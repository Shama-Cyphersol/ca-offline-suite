import json
import pickle
from datetime import datetime
import json
import os
from ..core.repository import *
from ..core.session_manager import SessionManager
# from .refresh import cummalative_person_sheets
from .refresh import cummalative_person_sheets
from .path_utils import get_base_dir, get_app_data_dir, get_resource_path
import sys

def ensure_file_exists(file_path, content):
    app_data_dir = get_app_data_dir()
    file_path = os.path.join(app_data_dir, file_path)

    # Check if the file exists
    if not os.path.exists(file_path):
        print(f"File {file_path} does not exist. Creating it...")
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w') as f:
            f.write(content)



def get_base_path():
    """
    Returns the base path for the project.
    Adjust this method if needed to correctly point to your project's root directory.
    """
    # This is a placeholder. You might need to modify this based on your project structure
    # return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

RESULT_DIR = os.path.join(get_base_path(), "src","data","results")
JSON_DIR = os.path.join(get_base_path(), "src","data","json")
REPORTS_DIR = os.path.join(get_base_path(), "src","data","reports")
CASE_FILE = os.path.join(get_base_path(), "src","data","json","cases.json")
MERGED_NAMES_FILE = os.path.join(get_base_path(), "src","data","json","merged_names.json")
SERIAL_NUMBER_FILE = os.path.join(get_base_path(), "src","data","json","serial_number_history.json")
UNITS_FILE = os.path.join(get_base_path(), "src","data","json","units.json")

def ensure_directories_exists(directory_path):
    # Check if the directory and files exists
    if not os.path.exists(directory_path):
        # Create the directory if it doesn't exist
        os.makedirs(directory_path)

def check_and_create_directories():
    # Check if the directories exist and create them if they don't
    ensure_directories_exists(RESULT_DIR)
    ensure_directories_exists(JSON_DIR)
    ensure_directories_exists(REPORTS_DIR)

def save_case_data(case_id, file_names, start_date, end_date,individual_names,pdf_paths_not_extracted,already_existing_pdfs):
    today_date = datetime.now().strftime("%d-%m-%Y")

    # Keep track of seen account numbers
    seen_acc_nums = set()
    indices_to_remove = []

    # Iterate through the list to find duplicates
    for i in range(len(individual_names["Acc Number"])):
        acc = individual_names["Acc Number"][i]
        if acc == "XXXXXXXXXXX":
            continue
        # If account number is already seen, mark for removal
        if acc in seen_acc_nums:
            indices_to_remove.append(i)
        else:
            # Add to seen set on first occurrence
            seen_acc_nums.add(acc)

    # Remove marked indices in reverse order to avoid index shifting
    for index in sorted(indices_to_remove, reverse=True):
        individual_names["Acc Number"].pop(index)
        individual_names["Name"].pop(index)
        file_names.pop(index)


    user = SessionManager.get_current_user()

    case_data = {
        'case_id': case_id,
        "user_id": user.id,
    }

    case_repo = CaseRepository()
    case = case_repo.get_case_by_id(case_id)
    if not case:
        print("Case not found. Creating a new case...")
        case = case_repo.create_case(case_data)

    print("Case created:", case)

    name = individual_names.get("Name") or []
    acc_number = individual_names.get("Acc Number") or []
    ifsc_code = individual_names.get("ifsc_code") or []
    bank_name = individual_names.get("bank_name") or []
    total_items = max(len(file_names), len(acc_number), len(name), len(ifsc_code), len(bank_name))

    for index in range(total_items):
        statement_data = {
            "case_id": case.case_id,
            "account_name": name[index] or "" if index < len(name) else "",
            "account_number": acc_number[index] or "" if index < len(acc_number) else "",
            "local_filename": file_names[index] or "" if index < len(file_names) else "",
            "ifsc_code": ifsc_code[index] or "" if index < len(ifsc_code) else "",
            "bank_name": bank_name[index] or "" if index < len(bank_name) else "",
        }

        statement_info = StatementInfoRepository()
        statement_info = statement_info.create_statement_info(statement_data)

    case_data = {
        "case_id": case_id,
        "file_names": file_names,
        "start_date": start_date,
        "end_date": end_date,
        "report_name": "Report_"+case_id,
        "individual_names":individual_names,
        "date":today_date,
        "pdf_paths_not_extracted":pdf_paths_not_extracted,
        "already_existing_pdfs":already_existing_pdfs
    }

    print("case_data from json logic ",case_data)

    # if len(file_names) == 1:
    #     case_data["start_date"] = start_date[0]
    #     case_data["end_date"] = end_date[0]
    # else:
    #     case_data["start_date"] = "-"
    #     case_data["end_date"] = "-"

    # Read existing data or initialize an empty list
    try:
        with open(CASE_FILE, "r") as f:
            existing_data = json.load(f)
    except:
        existing_data = []

    # Append the new case data to the beginning of the list
    existing_data.insert(0, case_data)
    # existing_data.append( case_data)

    # Write the updated data back to the file
    with open(CASE_FILE, "w") as f:
        json.dump(existing_data, f, indent=4)
    
    return case_data

def load_all_case_data():
    with open(CASE_FILE, "r") as f:
        return json.load(f)
    
def load_case_data(case_id):
    with open(CASE_FILE, "r") as f:
        data = json.load(f)
        for case in data:
            if case["case_id"] == case_id:
                return case
        return None

def update_case_data(case_id, new_case_data):
    """
    Updates an existing case's data in the JSON file.
    
    :param case_id: The ID of the case to update
    :param new_case_data: A dictionary containing the new case data
    :return: True if updated successfully, False otherwise
    """
    try:
        # Load existing data
        with open(CASE_FILE, "r") as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: Case data file not found.")
        return False

    case_found = False

    # Update the case if it exists
    for i, case in enumerate(data):
        if case["case_id"] == case_id:
            # Replace the old case data with the new one
            data[i] = {**case, **new_case_data}  # Merge existing data with new data
            case_found = True
            break

    if not case_found:
        print(f"Error: Case with ID {case_id} not found.")
        return False

    # Write the updated data back to the file
    with open(CASE_FILE, "w") as f:
        json.dump(data, f, indent=4)

    return True

def delete_case_data(case_id):
    # Load existing data from cases.json
    data = load_all_case_data()

    # Find the case with the matching ID
    for i, case in enumerate(data):
        if case["case_id"] == case_id:
            # Remove the case from the list
            data.pop(i)
            break
    else:
        print(f"Error: Case with ID {case_id} not found.")
        return False

    # Write the updated data back to the cases.json file
    with open(CASE_FILE, "w") as f:
        json.dump(data, f, indent=4)

    # Delete the .pkl file with the same name as the case_id
    pkl_file_path = os.path.join(RESULT_DIR, f"{case_id}.pkl")
    if os.path.exists(pkl_file_path):
        os.remove(pkl_file_path)
        print(f"Deleted file: {case_id}.pkl")
    else:
        print(f"Error: File {case_id}.pkl not found.")

    # Delete the related data from the merged_names.json file
    try:
        with open(MERGED_NAMES_FILE, "r") as f:
            merged_names_data = json.load(f)
    except FileNotFoundError:
        print("Error: merged_names.json file not found.")
        return False

    for i, obj in enumerate(merged_names_data):
        if obj["case_id"] == case_id:
            merged_names_data.pop(i)
            break
    else:
        print(f"Error: No object found with case_id {case_id} in merged_names.json.")

    with open(MERGED_NAMES_FILE, "w") as f:
        json.dump(merged_names_data, f, indent=4)
    
    # delete report file from data/reports
    report_file_path = os.path.join(REPORTS_DIR, f"Report_{case_id}.xlsx")
    if os.path.exists(report_file_path):
        os.remove(report_file_path)
        print(f"Deleted file: case_{case_id}_report.xlsx")
    else:
        print(f"Error: File case_{case_id}_report.xlsx not found.")
    
    return True


def save_result(CA_ID,result):
    path = os.path.join(RESULT_DIR,CA_ID+".pkl")
    with open(path, 'wb') as f:
        pickle.dump(result, f)

def load_result(CA_ID):
    path = os.path.join(RESULT_DIR,CA_ID+".pkl")

    try:
        with open(path, 'rb') as f:
            return pickle.load(f)
    except FileNotFoundError:
        print("File not found.")
        return {}
    
    

def check_and_add_date():
    # Get today's date in dd-mm-yyyy format
    today_date = datetime.now().strftime("%d-%m-%Y")
    
    # Load existing data from the JSON file
    try:
        with open(CASE_FILE, "r") as f:
            data = json.load(f)
    except FileNotFoundError:
        print("File not found.")
        return
    except json.JSONDecodeError:
        print("Error decoding JSON.")
        return

    # Check each entry and add date if missing
    for case in data:
        if "date" not in case:
            case["date"] = today_date

    # Save the updated data back to the JSON file
    with open(CASE_FILE, "w") as f:
        json.dump(data, f, indent=4)

    print("Date checked and added where missing.")

   
def update_name_merge_object(case_id, new_obj):
    merged_names_path = os.path.join(get_app_data_dir(), "data", "json", "merged_names.json")
    
    # Open the NER results JSON file
    with open(MERGED_NAMES_FILE, "r") as f:
        data = json.load(f)
    
    # Find the index of the object with the matching case_id
    for index, item in enumerate(data):
        if item.get('case_id') == case_id:
            # Update the existing object with the new object
            data[index] = new_obj
            break
    else:
        raise ValueError(f"No NER result found for case_id: {case_id}")
    
    # Write the updated data back to the file
    with open(MERGED_NAMES_FILE, "w") as f:
        json.dump(data, f, indent=4)

def create_name_merge_object(obj):
    # open name_merge.json which is an array and append this obj
    with open(MERGED_NAMES_FILE,"r") as f:
        data = json.load(f)
        data.append(obj)
    with open(MERGED_NAMES_FILE,"w") as f:
        json.dump(data,f,indent=4)
        

def find_merge_name_object(case_id):
    with open(MERGED_NAMES_FILE,"r") as f:
        data = json.load(f)
        for obj in data:
            if obj["case_id"] == case_id:
                return obj
        return None
    
def delete_name_merge_object(case_id):
    with open(MERGED_NAMES_FILE,"r") as f:
        data = json.load(f)
        for i, obj in enumerate(data):
            if obj["case_id"] == case_id:
                data.pop(i)
                break
    with open(MERGED_NAMES_FILE,"w") as f:
        json.dump(data,f,indent=4)

def get_process_df(case_id):
    data = load_result(case_id)
    return data["cummalative_df"]["process_df"]

def update_process_df(case_id, new_process_df):
    # rerun refresh function with new process_df
    try:
        data = load_result(case_id)
        name_acc_df = data["cummalative_df"]["name_acc_df"]
        new_cummalative_df = cummalative_person_sheets(new_process_df, name_acc_df)
        
        data["cummalative_df"] = new_cummalative_df
        save_result(case_id, data)
        return True
    except:
        print("Error updating process_df")
        return False
    
def fetch_units():
    with open(UNITS_FILE,"r") as f:
        return json.load(f)
    
def add_unit(unit):
    units_path = os.path.join(get_app_data_dir(), "data", "json", "units.json")
    units = fetch_units()
    units.append(unit)
    with open(UNITS_FILE,"w") as f:
        json.dump(units,f,indent=4)

def get_last_serial_number():
    with open(SERIAL_NUMBER_FILE,"r") as f:
        data = json.load(f)
        return data[0]

def update_serial_number_history(old_serial_number):
    serial_path = os.path.join(get_app_data_dir(), "data", "json", "serial_number_history.json")
    serial_number = get_last_serial_number()
    # print("old_serial_number",old_serial_number)
    # check if old serial number is a str or int
    # check if the old serial number string is covertable to int or not
    if isinstance(old_serial_number,str):
        try:
            old_serial_number = int(old_serial_number)
        except:
            return

    # print("old_serial_number",old_serial_number)
    if serial_number == old_serial_number:
        print("updating serial number")
        serial_number = [serial_number+1]
        with open(SERIAL_NUMBER_FILE,"w") as f:
            json.dump(serial_number,f,indent=4)


# test = load_result("ATS_unit_1_00010")
# cummalative_df =  test["cummalative_df"]["process_df"]
# print(cummalative_df.to_excel("dawat axis.xlsx"))
# single_df =  test["single_df"]["B1"]["data"][""]

# print(single_df.keys())

# test = load_result("CA_ID_SLXPFRN8LHTVEQ51")
# test = test["cummalative_df"]["bidirectional_analysis"]["bda_weekly_analysis"]
# print(test.keys())


# fifo = test["cummalative_df"]["fifo"]["fifo_weekly"]
# # test = test["cummalative_df"]["fifo"]["bda_weekly_analysis"]
# print(fifo)

# cases = load_all_case_data()
# for case in cases:    
#     acc_numbers = case["individual_names"]["Acc Number"]

# obj = find_merge_name_object("ATS_unit_1_00014")
# print(obj.keys())
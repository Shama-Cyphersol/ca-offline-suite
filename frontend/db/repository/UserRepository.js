// repositories/UserRepository.js
const { Op } = require('sequelize');  // Sequelize Operators for filtering
const User = require('../schema/User'); // Import User model (assuming it's already defined)

class UserRepository {
  // Create a new user
  static async createUser(data) {

    console.log("User Model : ", User? "present" : "Not present", User);
    try {
      const user = await User.create(data);
      return user.toJSON();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Could not create user');
    }
  }

  // Find a user by id
  static async getUserById(id) {
    try {
      const user = await User.findOne({ where: { id } });
      return user;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new Error('Could not fetch user');
    }
  }

  // Find a user by email
  static async getUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw new Error('Could not fetch user');
    }
  }

  // Update a user by id
  static async updateUser(id, updatedData) {
    try {
      const [updated] = await User.update(updatedData, {
        where: { id },
      });
      if (updated) {
        return await User.findOne({ where: { id } });
      }
      return null;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Could not update user');
    }
  }

  // Delete a user by id
  static async deleteUser(id) {
    try {
      const deleted = await User.destroy({ where: { id } });
      return deleted;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Could not delete user');
    }
  }

  // Get all users (with pagination, if needed)
  static async getAllUsers(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const users = await User.findAll({
        limit,
        offset,
      });
      return users;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw new Error('Could not fetch users');
    }
  }

  // Search users by username (example of filtering)
  static async searchUsersByUsername(username) {
    try {
      const users = await User.findAll({
        where: {
          username: {
            [Op.like]: `%${username}%`,  // Case-insensitive search
          },
        },
      });
      return users;
    } catch (error) {
      console.error('Error searching users by username:', error);
      throw new Error('Could not search users');
    }
  }
}

module.exports = UserRepository;

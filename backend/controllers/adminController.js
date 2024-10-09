import { Assignment } from "../models/Assignment.js";
import { User } from "../models/User.js";

//Get Assignment Feature in which his fullname is mention in assignment's admin field

export const getAssignmentsForAdmin = async (req, res) => {
  try {
    const adminId = req.id; //getting adminId
    const adminUser = await User.findById(adminId);

    if (!adminUser) {
      return res.status(404).json({
        message: "Admin not found",
        success: false,
      });
    }

    const adminFullName = adminUser.fullname; // Retrieve the admin's fullname

    // Fetch all assignments associated with this admin
    const assignments = await Assignment.find({
      admin: adminFullName,
    }).populate("userId", "fullname"); // Populating userId with the fullname of the user who uploaded the assignment

    //check for if any assignment present

    if (assignments.length === 0) {
      return res.status(404).json({
        message: "No assignments found for this admin",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Assignments fetched successfully",
      success: true,
      assignments,
    });
  } catch (error) {
    console.log(error);
  }
};

//Accept Assignment Feature:-

export const acceptAssignment = async (req, res) => {
  try {
    const adminId = req.id; // authenticated admin ID

    const adminUser = await User.findById(adminId);

    if (!adminUser) {
      return res.status(404).json({
        message: "Admin not found",
        success: false,
      });
    }

    const adminFullName = adminUser.fullname; //getting fullname
    const assignmentId = req.params.id; // to give assignment id to take any action on that assignment

    // Find the assignment by ID
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
        success: false,
      });
    }

    // Check if the admin fullname matches the admin field in the assignment
    if (assignment.admin !== adminFullName) {
      return res.status(403).json({
        message: "You are not authorized to accept this assignment",
        success: false,
      });
    }

    // Update the assignment status to 'accepted'
    assignment.status = "accepted";
    await assignment.save();

    return res.status(200).json({
      message: "Assignment accepted successfully",
      success: true,
      assignment,
    });
  } catch (error) {
    console.error(error);
  }
};

//Reject Assignment Feature:-

export const rejectAssignment = async (req, res) => {
  try {
    const adminId = req.id; // authenticated admin ID

    const adminUser = await User.findById(adminId);

    if (!adminUser) {
      return res.status(404).json({
        message: "Admin not found",
        success: false,
      });
    }

    const adminFullName = adminUser.fullname;
    const assignmentId = req.params.id; //getting assignment id

    // Find the assignment by ID
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
        success: false,
      });
    }

    // Check if the admin fullname matches the admin field in the assignment
    if (assignment.admin !== adminFullName) {
      return res.status(403).json({
        message: "You are not authorized to reject this assignment",
        success: false,
      });
    }

    // Update the assignment status to 'rejected'
    assignment.status = "rejected";
    await assignment.save();

    return res.status(200).json({
      message: "Assignment rejected successfully",
      success: true,
      assignment,
    });
  } catch (error) {
    console.error(error);
  }
};

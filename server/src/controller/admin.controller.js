import {
  deleteContactMessageService,
  deleteUserService,
  getAdminOverviewStats,
  getAllSystemInterviewsService,
  getAllSystemPaymentsService,
  getAllUsersService,
  getContactMessagesService,
  updateContactStatusService,
  updateUserPlanService,
  updateUserRoleService,
} from "../services/admin.service.js";

export const getAdminOverviewController = async (req, res) => {
  try {
    const stats = await getAdminOverviewStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("[Admin] overview error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const { search } = req.query;
    const users = await getAllUsersService(search);
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("[Admin] getUsers error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserPlanController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { plan } = req.body;
    const updated = await updateUserPlanService(userId, plan);
    res.status(200).json({ success: true, message: "User plan updated.", data: updated });
  } catch (error) {
    console.error("[Admin] updatePlan error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRoleController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const updated = await updateUserRoleService(userId, role);
    res.status(200).json({ success: true, message: "User role updated.", data: updated });
  } catch (error) {
    console.error("[Admin] updateRole error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    await deleteUserService(userId);
    res.status(200).json({ success: true, message: "User account deleted." });
  } catch (error) {
    console.error("[Admin] deleteUser error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getContactMessagesController = async (req, res) => {
  try {
    const messages = await getContactMessagesService();
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("[Admin] getContacts error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContactStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await updateContactStatusService(id, status);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin] updateContact error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContactMessageController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteContactMessageService(id);
    res.status(200).json({ success: true, message: "Message deleted." });
  } catch (error) {
    console.error("[Admin] deleteContact error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllSystemInterviewsController = async (req, res) => {
  try {
    const interviews = await getAllSystemInterviewsService();
    res.status(200).json({ success: true, data: interviews });
  } catch (error) {
    console.error("[Admin] getInterviews error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllSystemPaymentsController = async (req, res) => {
  try {
    const payments = await getAllSystemPaymentsService();
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error("[Admin] getPayments error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

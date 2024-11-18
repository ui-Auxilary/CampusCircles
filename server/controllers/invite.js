import prisma from "../client.js";

export const sendInvitation = async (req, res) => {
  try {
    const { eventId, inviteeId, inviterId } = req.body;

    console.log("Received request to send invitation:", { eventId, inviteeId, inviterId });

    // Check if the invitation already exists
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        eventId,
        inviteeId,
      },
    });

    if (existingInvitation) {
      console.log("Invitation already exists for inviteeId:", inviteeId);
      return res.status(400).json({
        status: false,
        message: "Invitation already sent to this user",
      });
    }

    // Create a new invitation
    const invitation = await prisma.invitation.create({
      data: {
        eventId,
        inviteeId,
        inviterId,
        status: "pending",
      },
    });

    console.log("Invitation created successfully:", invitation);
    res.status(201).json({
      status: true,
      message: "Invitation sent successfully",
      data: invitation,
    });
  } catch (e) {
    console.error("Server error when sending invitation:", e);
    res.status(500).json({
      status: false,
      message: "Server error: could not send invitation",
    });
  }
};

export const unsendInvitation = async (req, res) => {
  try {
    const { invitationId } = req.body;

    console.log("Received request to unsend invitation:", { invitationId });

    // Delete the invitation
    await prisma.invitation.delete({
      where: { id: invitationId },
    });

    console.log("Invitation unsent successfully:", invitationId);
    res.status(200).json({
      status: true,
      message: "Invitation unsent successfully",
    });
  } catch (e) {
    console.error("Server error when unsending invitation:", e);
    res.status(500).json({
      status: false,
      message: "Server error: could not unsend invitation",
    });
  }
};

export const updateInvitationStatus = async (req, res) => {
  try {
    const { invitationId, status } = req.body;

    const updatedInvitation = await prisma.invitation.update({
      where: { id: invitationId },
      data: { status },
    });

    res.status(200).json({
      status: true,
      message: "Invitation status updated successfully",
      data: updatedInvitation,
    });
  } catch (e) {
    console.error("Server error when updating invitation status:", e);
    res.status(500).json({
      status: false,
      message: "Server error: could not update invitation status",
    });
  }
};

export const getInvitationsForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const invitations = await prisma.invitation.findMany({
      where: {
        eventId,
      },
      include: {
        invitee: true,
        inviter: true,
      },
    });

    res.status(200).json({
      status: true,
      message: "Invitations fetched successfully",
      data: invitations,
    });
  } catch (e) {
    console.error("Server error when fetching invitations:", e);
    res.status(500).json({
      status: false,
      message: "Server error: could not fetch invitations",
    });
  }
};
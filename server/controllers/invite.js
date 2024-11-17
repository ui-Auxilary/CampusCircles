import prisma from "../client.js";

export const acceptInvite = async (req, res) => {
  try {
    const { id } = req.params;

    // Update invitation status to 'accepted'
    const invitation = await prisma.invitation.update({
      where: { id },
      data: { status: "accepted" },
      include: { event: true, invitee: true },
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found." });
    }

    // Add user to the event attendees
    await prisma.eventAttendee.create({
      data: {
        eventId: invitation.eventId,
        userId: invitation.inviteeId,
      },
    });

    res.status(200).json({ message: "Invitation accepted successfully." });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({ message: "Failed to accept invitation." });
  }
};

export const rejectInvite = async (req, res) => {
  try {
    const { id } = req.params;

    // Update invitation status to 'rejected'
    const invitation = await prisma.invitation.update({
      where: { id },
      data: { status: "rejected" },
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found." });
    }

    res.status(200).json({ message: "Invitation rejected successfully." });
  } catch (error) {
    console.error("Error rejecting invitation:", error);
    res.status(500).json({ message: "Failed to reject invitation." });
  }
};

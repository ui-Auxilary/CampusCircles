import prisma from "../client.js";

export const createEvent = async (req, res) => {
  console.log("Request", req.body);
  try {
    const eventData = {
      ...req.body,
    };

    const event = await prisma.event.create({
      data: eventData,
    });

    res.status(201).json({
      status: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await prisma.event.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.status(201).json({
      status: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: "Server error: could not update event",
    });
  }
};

export const getEvent = async (req, res) => {
  const event = await prisma.event.findFirst({
    where: {
      id: req.params.id,
    },
  });

  res.json({
    status: true,
    message: "Events fetched successfully",
    data: event,
  });
};

export const getEvents = async (req, res) => {
  const events = await prisma.event.findMany();

  res.json({
    status: true,
    message: "Events fetched successfully",
    data: events,
  });
};

export const getEventsToday = async (req, res) => {
  let dateToday = new Date(Date.now()).toISOString();
  let splitDate = dateToday.split("T")[0];
  let formatDate = `${splitDate}T00:00:00.000Z`;
  let formatRange = `${splitDate}T23:59:59.000Z`;

  const events = await prisma.event.findMany({
    where: {
      date: {
        lte: formatRange,
        gte: formatDate,
      },
    },
  });

  console.log("EVENTS", events);

  res.json({
    status: true,
    message: "Events fetched successfully",
    data: events,
  });
};

export const joinEvent = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    // Check if the user is already in the attendees list
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { eventAttendees: true },
    });

    if (event.eventAttendees.includes(userId)) {
      return res.status(400).json({
        status: false,
        message: "User has already joined this event",
      });
    }

    // Add the user to the attendees list if not already present
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        eventAttendees: {
          push: userId,
        },
      },
    });

    res.status(200).json({
      status: true,
      message: "User joined event successfully",
      data: updatedEvent,
    });
  } catch (e) {
    console.error("Server error when user joining event:", e);
    res.status(500).json({
      status: false,
      message: "Server error: could not join event",
    });
  }
};

export const leaveEvent = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    // Check if the user is part of the event attendees
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { eventAttendees: true },
    });

    if (!event.eventAttendees.includes(userId)) {
      return res.status(400).json({
        status: false,
        message: "User is not part of this event",
      });
    }

    // Update the event to remove the user from attendees
    const updatedAttendees = event.eventAttendees.filter((attendeeId) => attendeeId !== userId);

    await prisma.event.update({
      where: { id: eventId },
      data: {
        eventAttendees: {
          set: updatedAttendees,
        },
      },
    });

    res.status(200).json({
      status: true,
      message: "User left the event successfully",
    });
  } catch (e) {
    console.error("Server error when leaving event:", e);
    res.status(500).json({
      status: false,
      message: "Server error: could not leave event",
    });
  }
};

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
  let dateToday = new Date();
  dateToday.setHours(0, 0, 0, 0);

  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: dateToday.toISOString(),
      },
    },
  });

  res.json({
    status: true,
    message: "Events fetched successfully",
    data: events,
  });
};

import prisma from "../client.js";

export const createEvent = async (req, res) => {
  console.log("Request", req.body);
  try {
    const event = await prisma.event.create({
      data: req.body,
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

export const getEvents = async (req, res) => {
  const events = await prisma.event.findMany();

  res.json({
    status: true,
    message: "Events fetched successfully",
    data: events,
  });
};

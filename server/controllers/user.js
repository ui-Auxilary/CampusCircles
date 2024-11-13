import prisma from "../client.js";

export const createUser = async (req, res) => {
  console.log("Request", req.body);

  let userData = req.body;

  let defaultUser = {
    photo: "",
    gender: "",
    age: 0,
    bio: "",
    mbti: "",
    degree: "",
    studyYear: "",
    interests: [],
    courses: [],
    eventsAttend: {},
    eventsCreated: {},
    invReceived: {},
    invSent: {},
    friendIds: [],
  };

  userData["username"] = userData["username"].toLowerCase();
  userData["email"] = userData["email"].toLowerCase();

  try {
    const user = await prisma.user.create({
      data: { ...userData, ...defaultUser },
    });

    console.log("USER created", user);
    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: user.id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

export const loginUser = async (req, res) => {
  console.log("Request", req.body);
  let { username, password } = req.body;
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        AND: [
          {
            OR: [
              {
                username: username.toLowerCase(),
              },
              {
                email: username.toLowerCase(),
              },
            ],
          },
          {
            password,
          },
        ],
      },
    });

    console.log("USER", user);

    res.status(201).json({
      status: true,
      message: "User exists, logging them in",
      data: user.id,
    });
  } catch (e) {
    console.log("Invalid username or password", e);
    res.status(500).json({
      status: false,
      message: "Invalid username or password",
    });
  }
};

export const getUser = async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      id: req.params.id,
    },
  });

  res.json({
    status: true,
    message: "Users fetched successfully",
    data: user,
  });
};

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();

  res.json({
    status: true,
    message: "Users fetched successfully",
    data: users,
  });
};

export const updateUser = async (req, res) => {
  console.log("ID", req.params.id);
  let userData = req.body;
  console.log("data", userData);
  const users = await prisma.user.update({
    where: {
      id: req.params.id,
    },
    data: {
      name: userData.name || undefined,
      username: userData.username || undefined,
      email: userData.email || undefined,
      password: userData.password || undefined,
      photo: userData.photo || undefined,
      gender: userData.gender || undefined,
      age: userData.age || undefined,
      bio: userData.bio || undefined,
      languages: userData.languages || undefined,
      mbti: userData.mbti || undefined,
      degree: userData.degree || undefined,
      studyYear: userData.studyYear || undefined,
      interests: userData.interests || undefined,
      courses: userData.courses || undefined,
      eventsAttend: userData.eventsAttend || undefined,
      eventsCreated: userData.eventsCreated || undefined,
      invReceived: userData.invReceived || undefined,
      invSent: userData.invSent || undefined,
      friendIds: userData.friendIds || undefined,
    },
  });

  res.json({
    status: true,
    message: "Users fetched successfully",
    data: users,
  });
};

// Ethan: function used on index (homepage)
export const getUserNotifs = async (req, res) => {
  try {
    const userId = req.params.id;
    const notifications = await prisma.invitation.findMany({
      // find invitations matching user ID and is still pending
      where: { inviteeId: userId, status: "pending" },
      // extract invitations inviter name and photo, and event name
      include: {
        inviter: {
          select: { name: true, photo: true },
        },
        event: {
          select: { name: true },
        },
      },
      // order notifs based on recency
      orderBy: {
        id: "desc",
      },
    });

    res.json({
      status: true,
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

// Ethan: function used on index (homepage)
export const getUserEvents = async (req, res) => {
  try {
    const userId = req.params.id;

    // get events user created in order of creation
    const eventsCreated = await prisma.event.findMany({
      where: { creatorId: userId },
      orderBy: { createdAt: "desc" },
    });

    // get events user attending in order of most upcoming dates
    const eventsAttending = await prisma.eventAttendee.findMany({
      where: { userId: userId },
      include: { event: true },
      orderBy: {
        event: {
          date: "asc",
        },
      },
    });

    console.log("CREATED", eventsCreated, "ATTEND", eventsAttending);
    // extract only event object from eventsAttending
    res.json({
      status: true,
      message: "User events fetched successfully",
      data: {
        created: eventsCreated,
        attending: eventsAttending.map((attendee) => attendee.event),
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

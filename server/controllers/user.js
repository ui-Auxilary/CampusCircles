import { Prisma } from "@prisma/client";
import prisma from "../client.js";

export const createUser = async (req, res) => {
  console.log("Request", req.body);

  let userData = req.body;

  let defaultUser = {
    name: "",
    photo: "",
    gender: "",
    age: "",
    bio: "",
    mbti: "",
    gender: "",
    degree: "",
    studyYear: "",
    interests: "",
    courses: "",
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
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        res.status(400).json({
          status: false,
          message: "Username/email already exists",
        });
      }
    } else {
      res.status(500).json({
        status: false,
        message: "Server error",
      });
    }
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

export const getUserFriends = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { friendIds: true },
    });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const friends = await prisma.user.findMany({
      where: {
        id: { in: user.friendIds },
      },
      select: {
        id: true,
        name: true,
        photo: true,
        degree: true,
        studyYear: true,
      },
    });

    res.status(200).json({
      status: true,
      message: "Friends fetched successfully",
      data: friends,
    });
  } catch (error) {
    console.error("Failed to fetch friends:", error);
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};

export const getNonFriends = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { friendIds: true },
    });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const nonFriends = await prisma.user.findMany({
      where: {
        id: {
          notIn: [userId, ...user.friendIds],
        },
      },
      select: {
        id: true,
        name: true,
        photo: true,
        degree: true,
        studyYear: true,
      },
    });

    res.status(200).json({
      status: true,
      message: "Non-friend users fetched successfully",
      data: nonFriends,
    });
  } catch (error) {
    console.error("Failed to fetch non-friends:", error);
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};

export const addFriend = async (req, res) => {
  const userId = req.params.id;
  const { friendId } = req.body;

  console.log("Add friend request received:", { userId, friendId });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { friendIds: true },
    });

    const friend = await prisma.user.findUnique({
      where: { id: friendId },
      select: { friendIds: true },
    });

    if (!user || !friend) {
      console.error("User or friend not found:", userId, friendId);
      return res
        .status(404)
        .json({ status: false, message: "User or friend not found" });
    }

    if (user.friendIds.includes(friendId)) {
      console.error("User is already a friend:", friendId);
      return res
        .status(400)
        .json({ status: false, message: "User is already a friend" });
    }

    if (friend.friendIds.includes(userId)) {
      console.error("Friend is already connected:", userId);
      return res
        .status(400)
        .json({ status: false, message: "Friend is already connected" });
    }

    // Update the user to add the new friend
    await prisma.user.update({
      where: { id: userId },
      data: {
        friendIds: {
          push: friendId,
        },
      },
    });

    // Update the friend to add the current user
    await prisma.user.update({
      where: { id: friendId },
      data: {
        friendIds: {
          push: userId,
        },
      },
    });

    res.status(200).json({
      status: true,
      message: "Friend added successfully for both users",
    });
  } catch (error) {
    console.error("Failed to add friend:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const removeFriend = async (req, res) => {
  const userId = req.params.id;
  const { friendId } = req.body;

  console.log("Remove friend request received:", { userId, friendId });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { friendIds: true },
    });

    const friend = await prisma.user.findUnique({
      where: { id: friendId },
      select: { friendIds: true },
    });

    if (!user || !friend) {
      console.error("User or friend not found:", userId, friendId);
      return res
        .status(404)
        .json({ status: false, message: "User or friend not found" });
    }

    if (!user.friendIds.includes(friendId)) {
      console.error("User is not a friend:", friendId);
      return res
        .status(400)
        .json({ status: false, message: "User is not a friend" });
    }

    // Remove friendId from user's friendIds
    const updatedUserFriends = user.friendIds.filter((id) => id !== friendId);

    // Remove userId from friend's friendIds
    const updatedFriendFriends = friend.friendIds.filter((id) => id !== userId);

    await prisma.user.update({
      where: { id: userId },
      data: {
        friendIds: updatedUserFriends,
      },
    });

    await prisma.user.update({
      where: { id: friendId },
      data: {
        friendIds: updatedFriendFriends,
      },
    });

    res.status(200).json({
      status: true,
      message: "Friend removed successfully for both users",
    });
  } catch (error) {
    console.error("Failed to remove friend:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
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

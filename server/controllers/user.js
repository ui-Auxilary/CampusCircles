import prisma from '../client.js';

export const createUser = async (req, res) => {
  console.log('Request', req.body);
  try {
    const user = await prisma.user.create({
      data: req.body,
    });

    res.status(201).json({
      status: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      message: 'Server error',
    });
  }
};

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();

  res.json({
    status: true,
    message: 'Users fetched successfully',
    data: users,
  });
};

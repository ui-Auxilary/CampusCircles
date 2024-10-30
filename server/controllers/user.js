import prisma from '../client.js';

export const createUser = async (req, res) => {
  console.log('Request', req.body);

  let userData = req.body;

  userData['username'] = userData['username'].toLowerCase();
  userData['email'] = userData['email'].toLowerCase();

  try {
    const user = await prisma.user.create({
      data: userData,
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

export const loginUser = async (req, res) => {
  console.log('Request', req.body);
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

    console.log('USER', user);

    res.status(201).json({
      status: true,
      message: 'User exists, logging them in',
      data: user,
    });
  } catch (e) {
    console.log('Invalid username or password', e);
    res.status(500).json({
      status: false,
      message: 'Invalid username or password',
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

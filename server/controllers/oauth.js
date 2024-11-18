import "dotenv/config";

export const handleOAuthSignUp = async (req, res) => {
  console.log("REQUEST", req.query.code);
  if (req.query) {
    const url = `https://oauth2.googleapis.com/token?code=${req.query.code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=https://campus-circles.vercel.app/swg&grant_type=authorization_code`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((e) => console.log(e));

    console.log("here");
    const data = await response.json();
    console.log("data : ", response);

    // get the id token from the response
    const { id_token } = data;

    // verify the id token
    const verifyResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`
    );

    const verifyData = await verifyResponse.json();
    console.log("verifyData : ", verifyData);

    // get the user data from the verify data
    const { name, email, picture } = verifyData;

    // This res.send is the key to redirecting back to our expo go app.
    // ex: you have to enter your IP adress that is running your expo go application.
    res.send(
      `<script>window.location.replace("exp://10.0.0.59:8081/--/register?email=${email}&name=${name}&picture=${picture}")</script>`
    );
  } else {
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

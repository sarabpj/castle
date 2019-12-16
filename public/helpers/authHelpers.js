const users = [
  {
    id: 1,
    email: "beattles@example.com",
    username: "beattles",
    password: "cometogether"
  },
  {
    id: 2,
    email: "jcash@example.com",
    username: "jcash",
    password: "walktheline"
  },
  {
    id: 3,
    email: "ndiamond@example.com",
    username: "ndiamond",
    password: "sweetcaroline"
  }
];
// create auth helper file
export const authenticateUser = function(loginInfo) {
  const userArray = users.filter(user => {
    return (
      loginInfo.email === user.email && loginInfo.password === user.password
    );
  });

  const validEmail = users.find(user => user.email === loginInfo.email)

  const invalidLogin = {
    id: validEmail === undefined ? undefined : validEmail['id'],
    email: loginInfo.email
  };

  return userArray && userArray.length > 0 ? userArray[0] : invalidLogin;
};

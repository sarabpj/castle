"use strict";
const users = [
  {
    id: 1,
    email: "beattles@example.com",
    username: "beattles",
    password: "cometogether",
    registered_at: "2013-05-23T22:28:55.387Z"
  },
  {
    id: 2,
    email: "jcash@example.com",
    username: "jcash",
    password: "walktheline",
    registered_at: "2018-05-23T22:28:55.387Z"
  },
  {
    id: 3,
    email: "ndiamond@example.com",
    username: "ndiamond",
    password: "sweetcaroline",
    registered_at: "2019-02-23T22:28:55.387Z"
  },
  {
    id: 4,
    email: "a@example.com",
    username: "a",
    password: "a",
    registered_at: "2019-02-23T21:23:25.397Z"
  },
  {
    id: 5,
    email: "sara@example.com",
    username: "sara",
    password: "sara",
    registered_at: "2019-02-23T21:23:25.397Z"
  }
];


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

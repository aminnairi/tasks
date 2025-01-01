export interface Settings {
  jsonWebToken: {
    secret: string
  },
  administrator: {
    username: string,
    password: string
  }
}

export const settings: Settings = {
  jsonWebToken: {
    secret: "mysuperstrongsecretforjsonwebtoken"
  },
  administrator: {
    username: "",
    password: ""
  }
}
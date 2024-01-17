export interface User {
  id: number
  name: string
  email: string
  phone: string
  position: string
  position_id: number
  photo: string
}

export interface ServerData {
  total_pages: number
  users: User[]
}
import { seedAdmin } from "./admin";
import { seedMajor } from "./major";
import { seedUser } from "./user";

seedAdmin()
seedMajor()
seedUser()

console.log('Seeding completed!')
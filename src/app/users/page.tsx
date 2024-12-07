import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";
interface User {
  id:number,
  name:string
}
const UsersPage = async () => {
   const res = await fetch('https://jsonplaceholder.typicode.com/users')
  const users:User[] = await  res.json()
    return (
    <>
      <h1>Users Page</h1>
     <ul>
         {users.map(user => <li key={user.id}>{user.name}</li> )}
     </ul>
      <ProductCard />
    </>
  );
};
export default UsersPage;

import { Link } from "react-router-dom"

export default function LuxuryNavbar(){

return(

<nav className="sticky top-0 z-50 bg-beige shadow-soft">

<div className="flex justify-between items-center px-10 py-4">

<Link to="/">
<img src="/logo.png" className="h-12"/>
</Link>

<ul className="flex gap-8 text-brown font-medium">

<li className="hover:text-primary cursor-pointer">Home</li>
<li className="hover:text-primary cursor-pointer">Sarees</li>
<li className="hover:text-primary cursor-pointer">Kurtis</li>
<li className="hover:text-primary cursor-pointer">Jewellery</li>
<li className="hover:text-primary cursor-pointer">Home Decor</li>
<li className="hover:text-primary cursor-pointer">About</li>

</ul>

</div>

</nav>

)

}
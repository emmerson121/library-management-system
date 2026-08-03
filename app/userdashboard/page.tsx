

export default function UserDashboard() {
    return(
        <div className="w-full flex gap-10">
            <div className="w-[25%] p-4">
                <h2 className="text-black text-xl mb-4">Dashboard</h2>

                <ul className="text-black">
                    <li>Overview</li>
                    <li>Books</li>
                    <li>Authors</li>
                    <li>Borrow Book</li>
                    <li>Return Book</li>
                </ul>
            </div>

            <div className="w-[70%]">
                <h2 className="text-black text-2xl mb-4 font-bold">Overview</h2>

                <div className="flex gap-8">
                    {/* <div className="bg-[#0093cde3] w-70 h-28 rounded-md p-4">
                        <p className="mb-4 text-3xl">7</p>
                        <p className="text-xl">Books Available</p> 
                    </div> */}

                    <div className="bg-[#0093cde3] w-70 h-28 rounded-md p-4">
                        <p className="mb-4 text-3xl">7</p>
                        <p className="text-xl">Borrowed Books</p> 
                    </div>

                    <div className="bg-[#0093cde3] w-70 h-28 rounded-md p-4">
                        <p className="mb-4 text-3xl">5</p>
                        <p className="text-xl">Returned Books</p> 
                    </div>
                </div>
            </div>
        </div>
    )
}
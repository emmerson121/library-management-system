import type { ReactNode } from 'react';
import education from "../../public/education.png"

type Card = {
        id: number,
        image1?: ReactNode,
        title: string
    }
export default function MainDashboard() {

    const cards: Card[] = [
        {
          id: 1,
          image1: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 576L192 576C139 576 96 533 96 480L96 160C96 107 139 64 192 64L496 64C522.5 64 544 85.5 544 112L544 400C544 420.9 530.6 438.7 512 445.3L512 512C529.7 512 544 526.3 544 544C544 561.7 529.7 576 512 576L480 576zM192 448C174.3 448 160 462.3 160 480C160 497.7 174.3 512 192 512L448 512L448 448L192 448zM224 216C224 229.3 234.7 240 248 240L424 240C437.3 240 448 229.3 448 216C448 202.7 437.3 192 424 192L248 192C234.7 192 224 202.7 224 216zM248 288C234.7 288 224 298.7 224 312C224 325.3 234.7 336 248 336L424 336C437.3 336 448 325.3 448 312C448 298.7 437.3 288 424 288L248 288z" fill='white' stroke='white' strokeWidth="2"/></svg>
            // <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            //   <path d="M480 576L192 576C139 576 96 533 96 480L96 160C96 107 139 64 192 64L496 64C522.5 64 544 85.5 544 112L544 400C544 420.9 530.6 438.7 512 445.3L512 512C529.7 512 544 526.3 544 544C544 561.7 529.7 576 512 576L480 576zM192 448C174.3 448 160 462.3 160 480C160 497.7 174.3 512 192 512L448 512L448 448L192 448zM224 216C224 229.3 234.7 240 248 240L424 240C437.3 240 448 229.3 448 216C448 202.7 437.3 192 424 192L248 192C234.7 192 224 202.7 224 216zM248 288C234.7 288 224 298.7 224 312C224 325.3 234.7 336 248 336L424 336C437.3 336 448 325.3 448 312C448 298.7 437.3 288 424 288L248 288z" stroke='white' strokeWidth="2" />
            // </svg>
          ),
          title: "Total Books"
        },
        { id: 3, 
        image1: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M352.9 21.2L308 66.1 445.9 204 490.8 159.1C504.4 145.6 512 127.2 512 108s-7.6-37.6-21.2-51.1L455.1 21.2C441.6 7.6 423.2 0 404 0s-37.6 7.6-51.1 21.2zM274.1 100L58.9 315.1c-10.7 10.7-18.5 24.1-22.6 38.7L.9 481.6c-2.3 8.3 0 17.3 6.2 23.4s15.1 8.5 23.4 6.2l127.8-35.5c14.6-4.1 27.9-11.8 38.7-22.6L412 237.9 274.1 100z" fill='white' stroke='white' strokeWidth={1}/></svg>    
        ),    
        title: "Authors" },
        { id: 8,
        image1: (<svg width="20" height="20" fill="white" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75" fill='#0093cde3' stroke='#0093cde3' strokeWidth="2"/></svg>),
        // image1: (<img src="education.png" alt="Education" style={{ filter: "invert(1)" }} />),    
        title: "Students" },
        { id: 4, 
        image1: (<svg width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 128a80 80 0 1 1 160 0 80 80 0 1 1 -160 0zm208 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0zM48 480c0-70.7 57.3-128 128-128l96 0c70.7 0 128 57.3 128 128l0 8c0 13.3 10.7 24 24 24s24-10.7 24-24l0-8c0-97.2-78.8-176-176-176l-96 0C78.8 304 0 382.8 0 480l0 8c0 13.3 10.7 24 24 24s24-10.7 24-24l0-8z" fill='white' stroke='white' strokeWidth={1}/></svg>
        ),     
        title: "Attendants" },
        { id: 7, 
        image1: (<svg width="17" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3" strokeWidth="2"/></svg>
        ), 
        title: "Returned" },
        { id: 2, 
        image1: (<svg width="17" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
        ),    
        title: "Not Returned" },
    ]


    return(
        <div className="w-full p-4">
            {/* <div className="text-3xl text-black mb-6 font-bold">Library Management System</div> */}
            <div className="text-2xl text-black font-bold mb-6">Overview</div>
            <div className="flex flex-wrap gap-8 h-auto">
                {cards.map((card: Card, id) => (
                    <div key={id} className="w-70 h-28 bg-[#0093cde3] p-4 border-2 rounded-md">
                        <div className="text-3xl mb-5">{card.id}</div>
                        <div className='flex gap-2 items-center'>
                        {card.image1 && <div className="mb-2 w-[20px] h-[20px] pt-1">{card.image1}</div>}
                        <p className="text-xl font-bold">{card.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex justify-between text-black mt-4 mb-4'>
                <div>Recent activity</div>
                <div>See all</div>
            </div>

            <div className='flex flex-col gap-2'>
            <div className='flex justify-between p-4 bg-white w-full h-20 rounded-md'>
                <p className='text-black text-xl'>Ebiefie Emmerson</p>

                <div>
                    <div className='text-base font-bold text-[#033803] p-[8px 18px] mb-2'>Successful</div>
                    <div className='text-sm text-[#707070] text-center'>26-06-2026</div>
                </div>
            </div>

            <div className='flex justify-between p-4 bg-white w-full h-20 rounded-md'>
                <p className='text-black text-xl'>Azubuike Ugochi</p>

                <div>
                    <div className='text-base text-red-500 font-bold p-[8px 18px] mb-2'>Failed</div>
                    <div className='text-sm text-[#707070] text-center'>20-06-2026</div>
                </div>
            </div>

            <div className='flex justify-between p-4 bg-white w-full h-20 rounded-md'>
                <p className='text-black text-xl'>Friday Marvellous</p>

                <div>
                    <div className='text-[#033803] text-base font-bold p-[8px 18px] mb-2'>Successful</div>
                    <div className='text-sm text-[#707070] text-center'>17-06-2026</div>
                </div>
            </div>
            </div>
        </div>
    )
}
                

                // <div className="w-70 h-28 bg-[#0093cde3] p-4 border-2 rounded-md">
                //     <div className="text-3xl mb-5">3</div>
                //     <p className="text-base">Students</p>
                // </div>

                // <div className="w-70 h-28 bg-[#0093cde3] p-4 border-2 rounded-md">
                //     <div className="text-3xl mb-5">3</div>
                //     <p className="text-base">Authors</p>
                // </div>


                // <div className="w-70 h-28 bg-[#0093cde3] p-4 border-2 rounded-md">
                //     <div className="text-3xl mb-5">3</div>
                //     <p className="text-base">Attendants</p>
                // </div>


                // <div className="w-70 h-28 bg-[#0093cde3] p-4 border-2 rounded-md">
                //     <div className="text-3xl mb-5">3</div>
                //     <p className="text-base">Returned</p>
                // </div>

                // <div className="w-70 h-28 bg-[#0093cde3] p-4 border-2 rounded-md">
                //     <div className="text-3xl mb-5">3</div>
                //     <p className="text-base">Not Returned</p>
                // </div>
           
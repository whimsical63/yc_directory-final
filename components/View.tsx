import Ping from "@/components/Ping";
import {client} from "@/sanity/lib/client";
import {STARTUP_VIEWS_QUERY} from "@/sanity/lib/queries";
import { unstable_after as after } from "next/server";
import {writeClient} from "@/sanity/lib/write-client";


const View = async ({ id }: { id: string }) => {
    const { views: totalViews } = await client
        .withConfig({ useCdn: false })
        .fetch(STARTUP_VIEWS_QUERY, { id });

    after(
        async () =>
            await writeClient
                .patch(id)
                .set({ views: totalViews + 1 })
                .commit(),
    );

    return (
        <div className="view-container">
            <div className="absolute -top-2 -right-2">
                <Ping />
            </div>

            <p className="view-text">
                <span className="font-black">Views: {totalViews}</span>
            </p>
        </div>
    );
};
export default View;


// const View = async ({ id }: { id: string }) => {
//     const { views: totalViews } = await client
//         .withConfig({ useCdn: false })
//         .fetch(STARTUP_VIEWS_QUERY, { id });
//
//     // Update the views in a single transaction
//     await writeClient
//         .transaction()
//         .patch(id, (patch) => patch.inc({ views: 1 })) // Increment the view count atomically
//         .commit();
//
//     return (
//         <div className="view-container">
//             <div className="absolute -top-2 -right-2">
//                 <Ping />
//             </div>
//
//             <p className="view-text">
//                 <span className="font-black">Views: {totalViews + 1}</span>
//             </p>
//         </div>
//     );
// };
// export default View;


import { Images } from "@config";
import { UserData } from "@data";

const EventListData = [
    {
        id: "0",
        image: Images.event1,
        title: "Truckfighters: Performing Gravity X",
        subtitle: "Spirit Of Rock",
        location: "0408 Collier Falls Apt. 921",
        tracking: "3km",
        rate: 4.5,
        status: "Sold Out",
        price: "$900",
        priceSale: "$700",
        eventType: "Music",
        time: "15 Sep 2019",
        user: UserData,
        numTicket: 400,
        liked: true
    },
    {
        id: "1",
        image: Images.event2,
        title: "Paris Motor Show 2019",
        subtitle: "Spirit Of Rock",
        location: "Porte de Versailles, Paris, France",
        tracking: "3km",
        rate: 4.5,
        status: "Sold Out",
        price: "$700",
        priceSale: "$599",
        eventType: "Shows",
        time: "15 Sep 2019",
        user: UserData,
        numTicket: 400,
        liked: true
    },
    {
        id: "2",
        image: Images.event3,
        title: "Start-Up Meeting Oct 2019",
        subtitle: "Spirit Of Rock",
        location: "8790 San Francisco, CA",
        tracking: "3km",
        rate: 4.5,
        status: "Sold Out",
        price: "$700",
        priceSale: "$599",
        eventType: "Sience",
        time: "15 Sep 2019",
        user: UserData,
        numTicket: 400,
        liked: true
    },
    {
        id: "3",
        image: Images.event4,
        title: "BBC Music Introducing LIVE",
        subtitle: "Spirit Of Rock",
        location: "8790 San Francisco, CA",
        tracking: "3km",
        rate: 4.5,
        status: "Sold Out",
        price: "$700",
        priceSale: "$599",
        eventType: "Sience",
        time: "15 Sep 2019",
        user: UserData,
        numTicket: 400,
        liked: false
    }
];

export { EventListData };

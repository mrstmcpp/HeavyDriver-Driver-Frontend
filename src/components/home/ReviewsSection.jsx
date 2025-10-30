import React from "react";
import { Card } from "primereact/card";

const ReviewsSection = () => {
  const reviews = [
    {
      name: "Ravi Kumar",
      city: "Lucknow",
      img: "https://i.pravatar.cc/100?img=3",
      quote:
        "HeavyDriver helped me increase my earnings with transparent fares and regular rides!",
    },
    {
      name: "Sandeep Yadav",
      city: "Prayagraj",
      img: "https://i.pravatar.cc/100?img=6",
      quote:
        "Real-time tracking and navigation make every ride smooth. Passengers trust HeavyDriver!",
    },
    {
      name: "Amit Verma",
      city: "Kanpur",
      img: "https://i.pravatar.cc/100?img=9",
      quote:
        "The verification process ensures safety for everyone. I feel secure driving here!",
    },
  ];

  return (
    <section className="bg-gray-900 px-6 lg:px-20 py-20 border-t border-yellow-600 text-center relative">
      <h3 className="text-3xl font-bold text-yellow-400 mb-14">
        What Our Drivers Say
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {reviews.map((rev, idx) => (
          <Card
            key={idx}
            className="bg-black border border-yellow-500/40 text-yellow-400 hover:scale-105 shadow-md hover:shadow-yellow-600/30 transition-all duration-500"
          >
            <div className="flex flex-col items-center gap-4 p-6">
              <img
                src={rev.img}
                alt={rev.name}
                className="rounded-full w-20 h-20 border-2 border-yellow-500"
              />
              <p className="italic text-gray-300 max-w-xs">“{rev.quote}”</p>
              <h4 className="font-semibold">{rev.name}</h4>
              <p className="text-sm text-gray-500">{rev.city}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;

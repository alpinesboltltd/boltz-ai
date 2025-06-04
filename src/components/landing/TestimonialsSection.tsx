export function TestimonialsSection() {
  const testimonials = [
    {
      content: "Boltz.co has transformed our customer support. We've reduced response times by 80% and increased customer satisfaction scores by 35%.",
      author: "Sarah Johnson",
      role: "Customer Success Manager",
      company: "TechCorp Inc.",
      image: "/testimonials/sarah.jpg"
    },
    {
      content: "Setting up our AI chatbot took less than an hour. The no-code builder is incredibly intuitive, and the AI responses are impressively accurate.",
      author: "Michael Chen",
      role: "E-commerce Director",
      company: "Retail Solutions",
      image: "/testimonials/michael.jpg"
    },
    {
      content: "The ability to train our chatbot with our own knowledge base has been game-changing. It now handles 70% of our customer inquiries without human intervention.",
      author: "Jessica Patel",
      role: "Head of Support",
      company: "SaaS Platform",
      image: "/testimonials/jessica.jpg"
    }
  ];

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by innovative companies
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            See how businesses are transforming their customer experience with our AI chatbot platform.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <div>
                <div className="flex items-center gap-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
                <p className="mt-6 text-base italic leading-7 text-gray-600">"{testimonial.content}"</p>
              </div>
              <div className="mt-8 flex items-center gap-x-2">
                {[0, 1, 2, 3, 4].map((star) => (
                  <svg
                    key={star}
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-4 gap-8 md:grid-cols-5 lg:grid-cols-6">
            {/* Company logos would go here */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="col-span-1 flex justify-center grayscale opacity-60 transition hover:opacity-100 hover:grayscale-0">
                <div className="h-12 w-24 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500">Logo {i}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
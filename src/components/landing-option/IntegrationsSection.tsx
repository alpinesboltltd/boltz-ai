"use client";

export default function IntegrationsSection() {
  return (
    <section className="py-24 bg-slate-950 text-white overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Connected to Your Reality.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Sync with real-time data. Take action on your systems. From updating
            subscriptions to scheduling appointments.
          </p>
        </div>

        {/* Orbit Visual */}
        <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] mx-auto flex items-center justify-center">
          {/* Center Logo */}
          <div className="absolute z-10 w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border border-whit/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <span className="text-3xl font-bold tracking-tighter">LX</span>
          </div>

          {/* Orbit Rings */}
          <div className="absolute w-[70%] h-[70%] border border-dashed border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute w-[100%] h-[100%] border border-dashed border-white/5 rounded-full animate-[spin_30s_linear_infinite_reverse]" />

          {/* Floating Logos (Simplified placeholders) */}
          {/* In a real implementation, we could place them on the orbit path mathematically or just absolutely position with animation */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-white text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
            Stripe
          </div>
          <div className="absolute bottom-[20%] right-[10%] bg-[#00A4BD] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            HubSpot
          </div>
          <div className="absolute top-[30%] left-[5%] bg-[#00A1E0] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Salesforce
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 bg-[#4A154B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Slack
          </div>
        </div>
      </div>
    </section>
  );
}

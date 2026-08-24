// The interface is designed for a phone. On a wide screen it keeps those exact
// proportions inside a device frame, so the narrow column reads as a mobile app
// rather than an unfinished page. The frame scrolls internally, which is what
// keeps the mic bar pinned to the bottom of the device instead of the window.
export default function PhoneFrame({ children }) {
  return (
    <div className="min-h-full lg:flex lg:items-center lg:justify-center lg:p-8">
      <div className="w-full lg:h-[860px] lg:max-h-[calc(100vh-4rem)] lg:w-[420px] lg:overflow-hidden lg:rounded-[2.5rem] lg:border lg:border-neutral-800 lg:bg-surface lg:shadow-2xl lg:shadow-black/70">
        <div className="no-scrollbar lg:h-full lg:overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

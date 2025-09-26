export default function Tal3aCardAvatar({
  avatar,
  Zindex,
  translateX,
}: {
  avatar: string
  Zindex: number
  translateX: number
}) {
  return (
    <img
      src={avatar}
      className={`w-8 h-8 rounded-full border-2 border-white z-${Zindex} transform translate-x-${translateX}`}
      alt=""
    />
  )
}

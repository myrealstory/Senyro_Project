export const NextToField = ({
  isOpen,
  content,
}: { isOpen: boolean; content?: string }) => {
  if (!isOpen) {
    return <></>
  }
  
  return (
    <p className="text-center text-[#6A1648] font-[600] text-[15px]">{content}</p>
  )
}
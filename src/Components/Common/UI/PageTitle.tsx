
import { useTheme } from '../../../Context/ThemeContext'

const PageTitle = ({title}: { title: string }) => {
    const { themeStyles} = useTheme();
  return (
    <div className=" flex flex-col gap-2 m-0 px-5">
    <div className={`${themeStyles.primary} h-12 flex justify-center items-center w-48 rounded-sm ${themeStyles.text} `}>
        <span className='font-semibold text-2xl text-start '>{title}</span>
    </div>
    {/* <div className={`border-b-2 rounded-lg border-[#43996a]`}></div> */}
    </div>
  )
}

export default PageTitle
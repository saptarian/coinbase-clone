import Skeleton from 'react-loading-skeleton'
import { useLatestNews } from '@/lib/hooks'


const LatestNews = ({title, limit=5}: {
  title?: string
  limit?: number
}) => 
{
  const [news, isLoading] = useLatestNews(limit)

  return (
    <div className="py-5 divide-y space-y-3">
      {title ? 
        <h1 className="px-5 font-medium text-lg">
          {title}
        </h1>
      : ''}
      {news ? news.map(({url, title, description, thumbnail, createdAt}, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row gap-3 py-3 px-5">
          <span className="sm:w-[40%] sm:flex-none">
            <img src={thumbnail} />
          </span>
          <div className="flex flex-col">
            <div className="grow">
              <a href={url} target="_blank" className="">
                <h2 className="font-medium text-xl pb-1.5
                  hover:underline"> {title}
                </h2>
              </a>
              <p className=""> {description} </p>
            </div>
            <small className="font-medium mt-2 
              text-stone-600"> {createdAt}
            </small>
            <p className=""></p>
          </div>
        </div>
      )) : Array(2).fill(0).map((_,idx) => (
        <div key={idx} 
          className="grid grid-cols-5 px-5 py-3 gap-4">
          <div className="col-1 col-span-1">
            <Skeleton className="h-full" 
              enableAnimation={isLoading} />
          </div>
          <div className="col-2 col-span-3">
            <Skeleton count={3} 
              enableAnimation={isLoading} />
          </div>
        </div>
      )) }
    </div>
  )
}


export const NewsCard = ({title, limit=3}: {
  title?: string
  limit?: number
}) => 
{
  const [news, isLoading] = useLatestNews(limit)

  return (
    <div className="py-3 space-y-1.5">
      {title ? 
        <h1 className="px-5 font-medium text-lg">
          {title}
        </h1>
      : ''}
      <div className="flex flex-wrap">
        {news ? news.map(({url, title, description, thumbnail, createdAt}, idx) => (
          <div key={idx} className="flex flex-col gap-3 
            py-3 px-5 w-[280px] grow shrink-0">
            <span className="w-full flex-none">
              <img src={thumbnail} alt="" />
            </span>
            <div className="flex flex-col">
              <a href={url} target="_blank" className="">
                <h2 className="font-medium text-lg pb-1.5
                  hover:underline"> 
                  {title.length 
                    ? `${title.slice(0,48)}...`
                    : '...'
                  } 
                </h2>
              </a>
              <p className=""> 
                {description.length 
                  ? `${description.slice(0,64)}...`
                  : '...'
                } 
              </p>
              <small className="mt-2 text-stone-500">
                {createdAt}
              </small>
            </div>
          </div>
        )) : Array(2).fill(0).map((_,idx) => (
          <div key={idx} 
            className="w-60 py-3 space-y-2 px-5">
            <div className="">
              <Skeleton height="6rem" 
                enableAnimation={isLoading} />
            </div>
            <div className="">
              <Skeleton count={3} 
                enableAnimation={isLoading} />
            </div>
          </div>
        )) }
      </div>
    </div>
  )
}


export default LatestNews

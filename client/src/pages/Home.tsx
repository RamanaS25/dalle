import React, {useState, useEffect} from 'react'
import { Loader,Card, FormField } from '../components'



const Home = () => {

    const [loading, setLoading] = useState(false)
    const [allPosts, setAllPosts] = useState([])

    const [searchText, setSearchText] = useState('')

    const [SearchedResults, setSearchedResults] = useState(null)

    const [searchTimeOut, setSearchTimeOut] = useState<NodeJS.Timeout | null>(null);

    
useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)

      try {
        const response = await fetch('http://localhost:8080/api/v1/posts',{
            method: 'GET',
            headers: {
                   'Content-Type': 'application/json'
            },
        })

        if(response.ok){
            const result = await response.json()
            console.log('API response:', result);

            if(result.data.length > 0)  setAllPosts(result.data)
            
        }
    } catch (error) {
        alert(error)
    } finally {
        setLoading(false)
    }
    }


 
    fetchPosts()
 }, []);

 const handleSearchChange = (e) => {
    setSearchText(e.target.value)

    if (searchTimeOut) {
        clearTimeout(searchTimeOut);
    }
    
    setSearchTimeOut(
        setTimeout(() => {
            const searchResults: any = allPosts.filter(
                (item: any) =>
                    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.prompt.toLowerCase().includes(searchText.toLowerCase())
            );
    
            setSearchedResults(searchResults);
        }, 500)
    );

    
 }

  return (
    <section className='max-w-7x1 mx-auto'>

        <div>
            <h1 className='font-extrabold text-[#222328] text-[32px]'>
                The Community Showcase
            </h1>
            <p className='mt-2 text-[#66e75] text-[16px] max-w-[500px]'> Browse through a bunch of images genereated by Dall-e</p>
        </div>

        <div className='mt-16'>
        <FormField
          labelName="Search posts"
          type="text"
          name="text"
          placeholder="Search something..."
          value={searchText}
          handleChange={handleSearchChange}
        />
        </div>

        <div className='mt-10'>

            {loading ? (
                <div className='flex justify-center items-center'>

                    <Loader/>

                </div>
            ) :  (
                <>
                {searchText && (
                    <h2 className='font-medium text- [#666e75] text-xl mb-3'>
                       Showing results for <span className='text-[#222328]'> {searchText}</span>
                    </h2>
                )}

                <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
                    {searchText ? (
                        <RenderCards 
                        data={SearchedResults}
                        title='No search results found'/>
                    ) : (
                        <RenderCards 
                        data={allPosts}
                        title='No Posts Found'/>
                    )}
                </div>
                </>
            )}

        </div>

    </section>
  )
}

 
const RenderCards = ({ data, title }) => {
    console.log('data',data)
    
    if (data?.length > 0) {
      return (
        data.map((post) => <Card key={post._id} {...post} />)
      );
    }
  
    return (
      <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
    );
  };
export default Home
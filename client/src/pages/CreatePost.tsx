import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {preview} from '../assets'
import {getRandomPrompt} from '../utils'

import { FormField, Loader } from '../components'



const CreatePost = () => {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name:'',
    prompt:'',
    photo: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(form.prompt && form.photo){
      setLoading(true)

      try {
        const response = await fetch('https://dalle-etgw.onrender.com/api/v1/posts',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        })

        await response.json()
        navigate('/')
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false)
      }
    } else{
      alert('Please enter a prompt and name')
    }
  }

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const generateImage = async() => {
     if(form.prompt) {
      try {
        setGeneratingImg(true)
        const response = await fetch('https://dalle-etgw.onrender.com/api/v1/dalle', 

        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({prompt: form.prompt})

        } )

       

        const data = await response.json()

        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` })

      } catch (error) {
        console.log(form.prompt)
        alert(error)
      } finally {
        setGeneratingImg(false)
      }
     } else {
      alert('Enter a prompt!')
     }
  }

  const handleSurpriseMe = () => {
      const randomPrompt = getRandomPrompt(form.prompt)
      setForm({...form, prompt: randomPrompt })
  }

  const [generatingImg, setGeneratingImg] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    
    <section className='max-w-7xl mx-auto'>

        <div>
            <h1 className='font-extrabold text-[#222328] text-[32px]'>
                Create
            </h1>
            <p className='mt-2 text-[#66e75] text-[16px] max-w-[500px]'> Create Some Images..</p>
        </div> 

        <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-5'>

           
              
              <FormField
                labelName='Your Name'
                type='text'
                name='name'
                placeholder="Bhadra"
                value={form.name}
                handleChange={handleChange}
            
              />

              <FormField
                  labelName="Prompt"
                  type="text"
                  name="prompt"
                  placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
                  value={form.prompt}
                  handleChange={handleChange}
                  isSurpriseMe
                  handleSurpriseMe={handleSurpriseMe}
                />

              <div className='relative bg-grey-50 border border-grey-300 text-grey-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
                  {form.photo ? (
                    <img src={form.photo} alt={form.prompt}
                    className='w-full h-full object-container' />
                  ) : (
                    <img src={preview} alt='preview'
                    className='w-9/12 h-9/12 object-contain opacity-40' />
                  )}

                  {generatingImg &&  (
                    <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5] rounded-lg'>
                       <Loader/>
                    </div>
                  )}
              </div>

            </div>

            <div className='mt-5 flex gap-5'>
              <button
              type='button'
              onClick={generateImage}
              className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
               >
                {generatingImg ? 'Generating...' : 'Generate'}
               </button>
            </div>

            <div className='mt-10'>
              <p className='mt-2  text-[#666e75] text-[14px]'>Once you have created the Image, if you want you can share it with others</p>
              <button
              type='submit'
              className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
              >
                 {loading ? 'loading...' : 'Share'}
              </button>
            </div>
        </form>

    </section>
  )
}

export default CreatePost
import { useEffect, useState } from 'react'
import axios from 'axios';

function ServiceCard(props) {
  // service = props.service
  return (
    <div className="bg-secondary/10 hover:bg-primary/30 hover:scale-105 transition duration-300  text-text p-6 rounded-2xl mx-auto relative">
      {/* Header with logo and menu */}
      <div className="flex justify-between items-start mb-6">
        <div className='flex flex-row items-start justify-center gap-3'> 
        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
          <div className="w-6 h-6 bg-text rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-accent rounded-sm"></div>
          </div>
        </div>
        <div>
            <p className='text-md font-medium text-text'>John Doe</p>
            <p className='text-sm text-text/70'> Software Engineer</p>
          </div>
         </div> 
        <button className="text-xl font-bold text-secondary hover:text-text transition-colors">
          ...
        </button>
      </div>

      {/* Job Title */}
      <h2 className="text-xl font-semibold mb-3">
        Lorem ipsum dolor sit amet
      </h2>

      {/* Job Description */}
      <p className="text-text-/70 text-sm leading-relaxed mb-6">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
        voluptatum, quibusdam architecto quae, doloribus, voluptas
        reprehenderit quidem deserunt consequuntur doloremque atque
        distinctio. 
      </p>

      {/* Job Tags */}
      <div className="flex gap-3 mb-6">
        <span className="bg-secondary/50 text-gray-300 px-3 py-1 rounded-full text-xs">
          Lorem ipsum
        </span>
        <span className="bg-secondary/50 text-gray-300 px-3 py-1 rounded-full text-xs">
          5 years
        </span>
        <span className="bg-secondary/50 text-gray-300 px-3 py-1 rounded-full text-xs">
          Senior
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="bg-accent hover:bg-accent/70 text-text px-6 py-3 rounded-xl font-medium transition-colors flex-1">
          Apply Now
        </button>
        <button className="bg-primary hover:bg-primary/70 text-text px-6 py-3 rounded-xl font-medium transition-colors flex-1">
          Messages
        </button>
      </div>
    </div>
  );
}


function Services() {
  // const [services, setServices] = useState([]);
  // useEffect(() => {
  //   axios.get('http://localhost:8080/services/all')
  //     .then(res => {
  //     console.log(res.data);
  //     setServices(res.data.services);
  //     })
  //   .catch(err => console.error(err));
  // }, [])
  return (
    <section>
      <div className='grid grid-cols-1 md:grid-cols-3 w-full px-2 lg:px-10 mt-10 gap-5'> 
        
        {Array.from({ length: 10 }).map((_, index) => <ServiceCard key={index} />)}
      </div>
    </section>
  )
}


export default Services


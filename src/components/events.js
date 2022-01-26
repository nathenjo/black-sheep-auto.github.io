import React, { useEffect, useState } from 'react';
import axios from 'axios';

import EventDashboard from './eventDashboard';
import LoadingIcon from './loadingIcon';
import DeleteEventModal from './modals/deleteEventModal';

export default function Events(props){

    const {adminLogin} = props;

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventChanged, setEventChanged] = useState(false);
    const [deleteModal ,setDeleteModal] = useState(false);
    const [selectedModal, setSelectedModal] = useState('');
    
    useEffect(() => {
        setLoading(true)
    }, [])

    useEffect(() => {
        axios.get('http://localhost:5050/events')
        .then(response => {
            setEvents(response.data);
            setLoading(false);
        }).catch(error => {
            setEvents(events.concat([serverErrorItem]));
            setLoading(false);
        })
    }, [eventChanged])

    const serverErrorItem = {
        title: 'Check out our social media for events!'
    }

   return(
    <div className='events'>
        {adminLogin ? <EventDashboard setEventChanged={setEventChanged} className='events__event-dashboard' /> : null}
        {events.map((item, index) => {
            let itemDate = new Date(item.date).toLocaleString("en-US", {timeZone: "America/New_York", dateStyle: 'short', timeStyle: 'short'})
           return (
               <div key={index} className='events__event'>
                   <img
                        className='events__event__img'
                        src={item.imageUrl}
                        width={400}
                    />
                    <div className='events__event__text'>
                        <div className='events__event__text__title'>
                            {item.title}
                            {adminLogin && item.description ? <i onClick={() => setSelectedModal(item._id)&setDeleteModal(true)} className=" events__event__text__delete fas fa-trash-alt"></i> : null}
                            {adminLogin && item.description ? <i className=" events__event__text__edit far fa-edit"></i> : null}
                        </div>
                        <div className='events__event__text__description'>{item.description}</div>
                        <div className='events__event__text__description'>{itemDate}</div>
                        <DeleteEventModal events={events} selectedModal={selectedModal} setDeleteModal={setDeleteModal} deleteModal={deleteModal} item={item} />
                    </div>
               </div>
           )
       })}
       {loading ? <LoadingIcon className='events__loading-icon' /> : null}
     </div>
   );
}
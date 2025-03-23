"use client";
import { Button } from '@/once-ui/components';
import React, { useState } from 'react'

type Props = {}

function TagManagerTest({}: Props) {
  const [loading, setLoading] = useState(false);

    const fireEvent = (event: string) => {
        //@ts-ignore
        window?.dataLayer?.push({
          event: event,
          description: event+" is fired",
        });
      };


      async function sendEventToServer(){
        setLoading(true);
        const response = await fetch('/api/checkout', {
          method: 'POST',
          body: JSON.stringify({
            event: "hello world",
          }),
        });
        if(response.ok){
          console.log("Event sent successfully to server")
        }
        else{
          console.log("Event failed to send to server")
        }
        setLoading(false);
      }

  return (
    <div>
        {/* <Button className='m-2'  onClick={()=>fireEvent("Subscribe")}>Subscribe</Button>
        <Button className='m-2'  onClick={()=>fireEvent("Unsubscribe")}>Unsubscribe</Button>
        <Button className='m-2'  onClick={()=>fireEvent("Login")}>Login</Button>
        <Button className='m-2'  onClick={()=>fireEvent("Logout")}>Logout</Button>  */}
        <Button className='m-2' disabled={loading} onClick={()=>sendEventToServer()}>Send Event</Button> 
    </div>
  )
}

export default TagManagerTest
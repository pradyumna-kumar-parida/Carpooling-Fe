import Footer from '@/components/Footer'
import Header from '@/components/Header'
import VehicleDetails from '@/pages/vehicle/vehicle-details/VehicleDetails'
import { getVehicleListApi } from '@/services/server/vehicleService'
import React from 'react'

const page = async () => {
  const { data: vehicles } = await getVehicleListApi();
  return (
    <>

      <Header />
      <VehicleDetails vehiclesFetch={vehicles} />
      <Footer />
    </>

  )
}

export default page
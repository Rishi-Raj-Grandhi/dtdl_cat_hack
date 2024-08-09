import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
//import { Drive_component,Engine_component,Fuel_component,Misc_component } from './index.js';
const url = 'mongodb://localhost:27017/admin';
const port = 3000;
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
function Drive_component(Brake_control, Transminssion_pressure, Pedal_sensor) {
    let Brake_control_xx;
    let Transminssion_pressure_xx;
    let Pedal_sensor_xx;

    if (Brake_control > 1) {
        Brake_control_xx = 100;
    } else {
        Brake_control_xx = 50; // as it is med risk
    }

    if (Transminssion_pressure > 200 && Transminssion_pressure < 450) {
        Transminssion_pressure_xx = 100;
    } else {
        Transminssion_pressure_xx = 50;
    }

    if (Pedal_sensor < 4.7) {
        Pedal_sensor_xx = 100;
    } else {
        Pedal_sensor_xx = 75;
    }

    let res = ((Brake_control_xx + Transminssion_pressure_xx + Pedal_sensor_xx) / 300) * 100;
    return res;
}
function Engine_component(Engine_oil_pressure, Engine_speed, Engine_temp) {
    let Engine_oil_pressure_xx;
    let Engine_speed_xx;
    let Engine_temp_xx;

    if (Engine_oil_pressure >= 25 && Engine_oil_pressure <= 65) {
     
        Engine_oil_pressure_xx = 100;
    }
     else {
        Engine_oil_pressure_xx = 25;
    }

    if (Engine_speed < 1800) { 
     
        Engine_speed_xx = 100;
    } else {
        Engine_speed_xx = 50;
    }

    if (Engine_temp < 105) {
        
        Engine_temp_xx = 100;
    } else {
        Engine_temp_xx = 25;
    }

    let res = ((Engine_oil_pressure_xx + Engine_speed_xx + Engine_temp_xx) / 300) * 100;
    return res;
}
function Fuel_component(Fuel_level, Fuel_pressure, Fuel_temperature, Water_fuel) {
    let Fuel_level_xx;
    let Fuel_pressure_xx;
    let Fuel_temperature_xx;
    let Water_fuel_xx;

    // Constraint for Fuel Level
    if (Fuel_level >= 1) {
        Fuel_level_xx = 100;
    } else {
        Fuel_level_xx = 75;
    }

    // Constraint for Fuel Pressure
    if (Fuel_pressure >= 35 && Fuel_pressure <= 65) {
        Fuel_pressure_xx = 100;
    } else {
        Fuel_pressure_xx = 75;
    }

    // Constraint for Fuel Temperature
    if (Fuel_temperature < 400) {
        Fuel_temperature_xx = 100;
    } else {
        Fuel_temperature_xx = 25;
    }

    // Constraint for Water Fuel
    if (Water_fuel < 1800) {
        Water_fuel_xx = 100;
    } else {
        Water_fuel_xx = 25;
    }

    let res = ((Fuel_level_xx + Fuel_pressure_xx + Fuel_temperature_xx + Water_fuel_xx) / 400) * 100;
    return res;
}
function Misc_component(Air_filter_pressure, Exhaust_gas_temp, Hydraulic_pump_rate, System_voltage) {
    let Air_filter_pressure_xx;
    let Exhaust_gas_temp_xx;
    let Hydraulic_pump_rate_xx;
    let System_voltage_xx;
    // Constraint for Air Filter Pressure
    if (Air_filter_pressure >= 20) {
        Air_filter_pressure_xx = 100;
    } else {
        Air_filter_pressure_xx = 50;
    }

    // Constraint for Exhaust Gas Temperature
    if (Exhaust_gas_temp < 365) {
        Exhaust_gas_temp_xx = 100;
    } else {
        Exhaust_gas_temp_xx = 25;
    }

    // Constraint for Hydraulic Pump Rate
    if (Hydraulic_pump_rate <= 125) {
        Hydraulic_pump_rate_xx = 100;
    } else {
        Hydraulic_pump_rate_xx = 50;
    }

    // Constraint for System Voltage
    if (System_voltage >= 12 && System_voltage <= 15) {
        System_voltage_xx = 100;
    } else {
        System_voltage_xx = 25;
    }

    
    let res = ((Air_filter_pressure_xx + Exhaust_gas_temp_xx + Hydraulic_pump_rate_xx + System_voltage_xx) / 400) * 100;
    return res;
}
app.post("/", async (req, res) => {
    try {
        const data = await mongoose.connection.db.collection('sensor_data').findOne({}, { sort: { _id: -1 } });
        if (!data) {
            return res.status(404).json({ message: 'No data found' });
        }

        const {
            Brake_control, Transminssion_pressure, Pedal_sensor,
            Engine_oil_pressure, Engine_speed, Engine_temp,
            Fuel_level, Fuel_pressure, Fuel_temperature, Water_fuel,
            Air_filter_pressure, Exhaust_gas_temp, Hydraulic_pump_rate, System_voltage
        } = data;

        const drive = Drive_component(Brake_control, Transminssion_pressure, Pedal_sensor);
        const engine = Engine_component(Engine_oil_pressure, Engine_speed, Engine_temp);
        const fuel = Fuel_component(Fuel_level, Fuel_pressure, Fuel_temperature, Water_fuel);
        const misc = Misc_component(Air_filter_pressure, Exhaust_gas_temp, Hydraulic_pump_rate, System_voltage);

        const jsonresponse = {
            drive,
            engine,
            fuel,
            misc
        };

        res.json(jsonresponse);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Server error' });
    }

});
/*
app.post("/",(req,res)=>{
    const {Brake_control, Transminssion_pressure, Pedal_sensor,Engine_oil_pressure, Engine_speed, Engine_temp,Fuel_level, Fuel_pressure, Fuel_temperature, Water_fuel,Air_filter_pressure, Exhaust_gas_temp, Hydraulic_pump_rate, System_voltage}=req.body;
    const drive=Drive_component(Brake_control,Transminssion_pressure,Pedal_sensor);
    const engine=Engine_component(Engine_oil_pressure,Engine_speed,Engine_temp);
    const fuel=Fuel_component(Fuel_level,Fuel_pressure,Fuel_temperature,Water_fuel);
    const misc=Misc_component(Air_filter_pressure,Exhaust_gas_temp,Hydraulic_pump_rate,System_voltage);
    const jsonresponse={
      drive:drive,
      engine:engine,
      fuel:fuel,
      misc:misc
    }  
    res.json(jsonresponse);
  })
  app.post("/fuel",(req,res)=>{
    const {Brake_control, Transminssion_pressure, Pedal_sensor,Engine_oil_pressure, Engine_speed, Engine_temp,Fuel_level, Fuel_pressure, Fuel_temperature, Water_fuel,Air_filter_pressure, Exhaust_gas_temp, Hydraulic_pump_rate, System_voltage}=req.body;
    const drive=Drive_component(Brake_control,Transminssion_pressure,Pedal_sensor);
    const engine=Engine_component(Engine_oil_pressure,Engine_speed,Engine_temp);
    const fuel=Fuel_component(Fuel_level,Fuel_pressure,Fuel_temperature,Water_fuel);
    const misc=Misc_component(Air_filter_pressure,Exhaust_gas_temp,Hydraulic_pump_rate,System_voltage);
    const jsonresponse={
      drive:drive,
      engine:engine,
      fuel:fuel,
      misc:misc
    }  
    res.json(jsonresponse);
  })
  app.post("/misc",(req,res)=>{
    const {Brake_control, Transminssion_pressure, Pedal_sensor,Engine_oil_pressure, Engine_speed, Engine_temp,Fuel_level, Fuel_pressure, Fuel_temperature, Water_fuel,Air_filter_pressure, Exhaust_gas_temp, Hydraulic_pump_rate, System_voltage}=req.body;
    const drive=Drive_component(Brake_control,Transminssion_pressure,Pedal_sensor);
    const engine=Engine_component(Engine_oil_pressure,Engine_speed,Engine_temp);
    const fuel=Fuel_component(Fuel_level,Fuel_pressure,Fuel_temperature,Water_fuel);
    const misc=Misc_component(Air_filter_pressure,Exhaust_gas_temp,Hydraulic_pump_rate,System_voltage);
    const jsonresponse={
      drive:drive,
      engine:engine,
      fuel:fuel,
      misc:misc
    }  
    res.json(jsonresponse);
  })
  
  
*/
app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
  
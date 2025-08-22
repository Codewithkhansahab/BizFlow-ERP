import Attendance from "../models/Attendace.js";
import User from "../models/User.js";
import moment from "moment/moment.js";

export const checkIn = async (req,res)=>{

    try{

        const userId = req.user._id;
        const today = new Date();
        today.setHours(0,0,0,0)

        const alreadyCheckedIn = await Attendance.findOne({user : userId, date: today});
        if(alreadyCheckedIn){
            return res.status(400).json({message : "Alredy checked in Today"})
        }

        const attendance = await Attendance.create({
            user: userId,
            date: today,
            checkIn: new Date(),
            status: "Present",
        });
        res.status(201).json({message : "Checked in Successfully",attendance})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message : "Check in failed"})
    }

}

export const checkOut = async (req,res)=>{

    try{
        const userId = req.user._id;
        const start = new Date();
start.setHours(0, 0, 0, 0);

const end = new Date();
end.setHours(23, 59, 59, 999);

const attendance = await Attendance.findOne({
  user: userId,
  date: { $gte: start, $lt: end }
});
       // const attendance = await Attendance.findOne({user : userId,date:today})
        if(!attendance){
            return res.status(404).json({message: "No check in found for today"})
        }
        if(attendance.checkOut){
            return res.status(400).json({message : "Alredy checked out today"})
        }
        const checkOutTime = new Date();
        const totalms = checkOutTime-new Date(attendance.checkIn);
        const totalHours = totalms / (1000 * 60 * 60);

        attendance.checkOut = checkOutTime;
        attendance.totalHours = parseFloat(totalHours.toFixed(2));
        await attendance.save();
        res.status(201).json({message : "Checked Out Successfully",attendance})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message : "Check out failed"})
    }

}

export const getSummary = async (req,res)=>{

try{
    const userId = req.user._id;

     const records = await Attendance.find({user : userId})
        .sort({date : -1})
        
      const formatted = records.map((rec) => ({
      date: moment(rec.date).format("YYYY-MMMM-DD"),
      isoDate: rec.date instanceof Date ? rec.date.toISOString() : new Date(rec.date).toISOString(),
      checkIn: rec.checkIn ? moment(rec.checkIn).format("hh:mm A") : "N/A",
      checkOut: rec.checkOut ? moment(rec.checkOut).format("hh:mm A") : "N/A",
      checkInISO: rec.checkIn instanceof Date ? rec.checkIn.toISOString() : (rec.checkIn ? new Date(rec.checkIn).toISOString() : null),
      checkOutISO: rec.checkOut instanceof Date ? rec.checkOut.toISOString() : (rec.checkOut ? new Date(rec.checkOut).toISOString() : null),
      totalHours: rec.totalHours ?? 0,
      status: rec.status
    }));
    res.status(200).json({
        totalRecords : formatted.length,
        attendance : formatted,
    })
}
catch(err){
    console.log(err)
    res.status(500).json({message : " some error is there"})
} 
}

export const getAllAttendance = async (req,res)=>{

    try{
        const attendanceRecords = await Attendance.find()
            .populate("user","name email role")
            .sort({date : -1})
        const formatted = attendanceRecords.map((rec)=>{
            return{
            user : rec.user?.name ?? "Unknown",
            email: rec.user?.email ?? "N/A",
            role : rec.user?.role ?? "N/A",
            date : moment(rec.date).format("YYYY-MMMM-DD"),
            checkIn : rec.checkIn ? moment(rec.checkIn).format("hh:mm A") :"N/A",
            checkOut : rec.checkOut ? moment(rec.checkOut).format("hh:mm A"):"N/A",
            totalHours : rec.totalHours ?? 0,
            status : rec.status
        }
        })
        res.status(200).json({
            totalRecords : formatted.length,
            data : formatted
        })
    }
    catch(err){

        console.log(err)
        res.status(500).json({message : "failed tpo fetch attendance records"})

    }

}

export const filterAttendance = async (req,res)=>{

    try{

        const {from,to,month,year,week} = req.query;

        let query = {}
        if(from && to ){
            query.date = {
                $gte : new Date(from),
                $lte : new Date(to)
            }
        }

        else if(month && year){
            const start = moment(`${year}-${month}-01`).startOf("month").toDate();
            const end = moment(`${year}-${month}-01`).endOf("month").toDate();
            
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to filter attendance" });
    }

}
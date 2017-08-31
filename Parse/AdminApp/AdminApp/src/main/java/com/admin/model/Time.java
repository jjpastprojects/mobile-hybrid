package com.admin.model;

import com.admin.AppConstant;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * @desc POJO for Time object
 */
public class Time {
    int m_nHour;
    int m_nMinute;
    public Time(){}
    public Time(int hour, int minute){
        m_nHour = hour;
        m_nMinute = minute;
    }

    public void setTimeValue(int hour, int minute){
        m_nHour = hour;
        m_nMinute = minute;
    }
    public void setHour(int hour){ m_nHour = hour;}
    public int getHour(){ return m_nHour;}
    public void setMinute(int minute){ m_nMinute = minute;}
    public int getMinute(){ return m_nMinute;}
    public String convertString(){
        return "" + m_nHour + ":" + m_nMinute;
    }
    public void parseData(String timeStr){
        if(timeStr != null && !timeStr.equals("")) {
            String strHour = timeStr.substring(0, timeStr.indexOf(':'));
            String strMinute = timeStr.substring(timeStr.indexOf(':') + 1, timeStr.length());
            m_nHour = Integer.valueOf(strHour);
            m_nMinute = Integer.valueOf(strMinute);
        } else{
            m_nHour = AppConstant.EMPTY_VALUE;
            m_nMinute = AppConstant.EMPTY_VALUE;
        }
    }

}

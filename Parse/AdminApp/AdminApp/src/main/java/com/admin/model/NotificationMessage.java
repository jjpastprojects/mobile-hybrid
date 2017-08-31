package com.admin.model;

import com.admin.AppConstant;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * @desc POJO for NotificaitonMessage
 */
public class NotificationMessage {
    private JSONObject jsonObject;
    private int m_nSongInterval, m_nPauseInterval;
    private Time m_startTime, m_endTime;
    public NotificationMessage(boolean isBackground, Time start, Time end, String songInterval, String pauseInterval) {
        makeJSONObject(isBackground, start, end, songInterval, pauseInterval);
    }

    private void makeJSONObject(boolean isBackground, Time start, Time end, String songInterval, String pauseInterval) {
        JSONObject json_Data = new JSONObject();
        try {
            json_Data.put(AppConstant.FIELD_START_TIME, start.convertString());
            json_Data.put(AppConstant.FIELD_END_TIME, end.convertString());
            json_Data.put(AppConstant.FIELD_INTERVAL_SONGS, songInterval);
            json_Data.put(AppConstant.FIELD_INTERVAL_PAUSE, pauseInterval);
            jsonObject = new JSONObject();
            jsonObject.put(AppConstant.FIELD_PLAY_INFO, json_Data);
            jsonObject.put(AppConstant.NOTIFY_IS_BACKGROUND, isBackground);
        }catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public JSONObject getJsonObject() {
        return  jsonObject;
    }
}

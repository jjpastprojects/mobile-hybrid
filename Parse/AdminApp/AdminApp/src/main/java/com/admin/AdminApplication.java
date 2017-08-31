package com.admin;

import android.app.Application;
import android.content.Context;
import android.os.Bundle;
import android.text.Html;
import android.widget.Toast;

import com.admin.parsemodel.ConnectionStatus;
import com.admin.parsemodel.DeviceSettings;
import com.parse.Parse;
import com.parse.ParseInstallation;
import com.parse.ParseObject;
import com.parse.ParseUser;

import java.util.Date;

/**
 * @desc Application class for AdminApp
 */
public class AdminApplication extends Application {

    public static Context mContext;
    @Override
    public void onCreate() {
        // TODO Auto-generated method stub
        super.onCreate();
        mContext = this.getApplicationContext();
        ParseObject.registerSubclass(ConnectionStatus.class);
        ParseObject.registerSubclass(DeviceSettings.class);
        Parse.initialize(this, AppConstant.PARSE_APP_ID, AppConstant.PARSE_CLIENT_KEY);
        ParseUser.enableAutomaticUser();
        ParseInstallation currentInstall = ParseInstallation.getCurrentInstallation();
        currentInstall.saveInBackground();
    }

    public static Context getContext() {
        return mContext;
    }

    public static void showMessage(String message, int nType) {
        Toast.makeText(mContext, message, nType).show();
    }


}

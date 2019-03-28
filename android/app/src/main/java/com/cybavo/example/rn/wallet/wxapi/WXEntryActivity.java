package com.cybavo.example.rn.wallet.wxapi;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import com.theweflex.react.WeChatModule;

public class WXEntryActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            WeChatModule.handleIntent(getIntent());
        } catch (Exception e) {
            e.printStackTrace();
        }
        finish();
    }
}

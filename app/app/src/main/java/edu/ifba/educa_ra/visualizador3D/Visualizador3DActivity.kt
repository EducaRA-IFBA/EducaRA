package edu.ifba.educa_ra.visualizador3D

import android.app.Activity
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import edu.ifba.educa_ra.R

class Visualizador3DActivity: Activity() {

    private var webView: WebView? = null
    private var modelPath: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_visualizador_3d)

        webView = findViewById<WebView>(R.id.webView3D)
        webView?.apply {
            settings.javaScriptEnabled = true
            settings.allowFileAccess = true
            settings.allowFileAccessFromFileURLs = true
            webViewClient = WebViewClient()
            addJavascriptInterface(JSInterface(), "Android")
            loadUrl("file:///android_asset/visualizador3d.html")
        }

        val b = intent.extras
        if (b != null) {
            modelPath = b.getString("model")
        }
    }

    override fun onResume() {
        super.onResume()
        // WebView gerencia renderização automaticamente
    }

    override fun onPause() {
        super.onPause()
        // Pausar se necessário
    }

    override fun onDestroy() {
        super.onDestroy()
        webView?.destroy()
    }

    inner class JSInterface {
        @JavascriptInterface
        fun getModelPath(): String {
            return modelPath ?: ""
        }
    }
}
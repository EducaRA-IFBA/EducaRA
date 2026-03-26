@file:Suppress("DEPRECATION")
package edu.ifba.educa_ra.api

import android.os.AsyncTask
import android.util.Log
import edu.ifba.educa_ra.dados.modelo.AulaModelo
import edu.ifba.educa_ra.dados.modelo.ConteudoModelo
import edu.ifba.educa_ra.dados.modelo.DisciplinaModelo
import org.json.JSONArray
import org.json.JSONObject
import java.io.*
import java.net.HttpURLConnection
import java.net.URL
import java.util.zip.ZipFile
import kotlin.reflect.KFunction1

//const val URL_SERVICOS = "http://192.168.0.105"
const val PORTA_SERVICOS = "9000"
const val URL_SERVICOS = "http://10.0.2.2:$PORTA_SERVICOS/api/v1"

const val URL_ALIVE = "$URL_SERVICOS/alive"
const val URL_DISCIPLINAS = "$URL_SERVICOS/disciplinas"
const val URL_AULAS = "$URL_SERVICOS/aulas"
const val URL_CONTEUDOS = "$URL_SERVICOS/conteudos"

const val PORTA_OBJETOS = "8009"
const val URL_OBJETOS = "http://10.0.2.2:$PORTA_OBJETOS"

fun toJson(stream: InputStream): String {
    val json = StringBuilder()

    val reader = BufferedReader(InputStreamReader(stream, "utf-8"))
    var linha: String?
    while (reader.readLine().also { linha = it } != null) {
        json.append(linha!!.trim { it <= ' ' })
    }

    return json.toString()
}

fun isAlive(): Boolean {
    var alive = false

    try {
        val url = URL(URL_ALIVE)
        val conn = url.openConnection() as HttpURLConnection
        conn.connectTimeout = 2000
        conn.readTimeout = 2000

        val json = toJson(conn.inputStream)
        val resposta = JSONObject(json)

        alive = resposta.getBoolean("alive")
    } catch (e: Exception) {
        Log.e("isAlive()", e.toString())
    }

    return alive
}

class IsAlive(private val onAlive: KFunction1<Boolean, Unit>) :
    AsyncTask<Void, Void, Boolean>() {

    override fun doInBackground(vararg params: Void?): Boolean {
        var alive = false

        try {
            alive = isAlive()
        } catch (e: Exception) {
            Log.e("IsAlive()", e.toString())
        }

        return alive
    }

    override fun onPostExecute(alive: Boolean) {
        super.onPostExecute(alive)

        onAlive(alive)
    }

}

class GetDisciplinas(private val onDisciplinas: KFunction1<List<DisciplinaModelo>, Unit>) :
    AsyncTask<Void, Void, List<DisciplinaModelo>>() {

    private fun toDisciplinaModelo(objetos: JSONArray): List<DisciplinaModelo> {
        val disciplinas = arrayListOf<DisciplinaModelo>()

        for (i in 0 until objetos.length()) {
            val objeto = objetos.get(i) as JSONObject

            disciplinas.add(
                DisciplinaModelo(
                    id = objeto.getString("id"),
                    nome = objeto.getString("nome"),
                    sigla = objeto.getString("sigla")
                )
            )
        }

        return disciplinas
    }

    override fun doInBackground(vararg v: Void): List<DisciplinaModelo> {
        var disciplinas: List<DisciplinaModelo> = arrayListOf()

        try {
            if (isAlive()) {
                val url = URL(URL_DISCIPLINAS)
                val conn = url.openConnection() as HttpURLConnection
                val json = toJson(conn.inputStream)

                val itens = JSONObject(json).getJSONArray("disciplinas")
                disciplinas = toDisciplinaModelo(itens)
            }
        } catch (e: Exception) {
            Log.e("GetDisciplinas()", e.toString())
        }

        return disciplinas
    }

    @Deprecated("Deprecated in Java")
    override fun onPostExecute(disciplinas: List<DisciplinaModelo>) {
        super.onPostExecute(disciplinas)

        onDisciplinas(disciplinas)
    }
}

class GetAulas(private val idDisciplina: String, private val onAulas: KFunction1<List<AulaModelo>, Unit>) :
    AsyncTask<Void, Void, List<AulaModelo>>() {

    private fun toAulas(objetos: JSONArray): List<AulaModelo> {
        val aulas = arrayListOf<AulaModelo>()

        for (i in 0 until objetos.length()) {
            val objeto = objetos.get(i) as JSONObject

            aulas.add(
                AulaModelo(
                objeto.getString("id"),
                objeto.getString("nome"),
                objeto.getString("observacao"),
                idDisciplina)
            )
        }

        return aulas
    }

    override fun doInBackground(vararg v: Void): List<AulaModelo> {
        var aulas: List<AulaModelo> = arrayListOf()

        try {
            if (isAlive()) {
                val url = URL("$URL_AULAS/$idDisciplina")
                val conn = url.openConnection() as HttpURLConnection
                val json = toJson(conn.inputStream)

                val itens = JSONObject(json).getJSONArray("aulas")
                aulas = toAulas(itens)
            }
        } catch (e: Exception) {
            Log.e("GetAulas()", e.toString())
        }

        return aulas
    }

    override fun onPostExecute(aulas: List<AulaModelo>) {
        super.onPostExecute(aulas)

        onAulas(aulas)
    }

}

class GetConteudos(private val idAula: String, private val onConteudos: KFunction1<List<ConteudoModelo>, Unit>) :
    AsyncTask<Void, Void, List<ConteudoModelo>>() {

    private fun toConteudos(objetos: JSONArray): List<ConteudoModelo> {
        val conteudos = arrayListOf<ConteudoModelo>()

        for (i in 0 until objetos.length()) {
            val objeto = objetos.get(i) as JSONObject
            val zip = objeto.getString("objeto")

            conteudos.add(
                ConteudoModelo(
                    objeto.getString("id"),
                    objeto.getString("nome"),
                    objeto.getString("descricao"),
                    "$URL_OBJETOS/$zip",
                    idAula
                )
            )
        }

        return conteudos
    }

    override fun doInBackground(vararg v: Void): List<ConteudoModelo> {
        var conteudos: List<ConteudoModelo> = arrayListOf<ConteudoModelo>()

        try {
            if (isAlive()) {
                val url = URL("$URL_CONTEUDOS/$idAula")
                val conn = url.openConnection() as HttpURLConnection
                val json = toJson(conn.inputStream)

                val itens = JSONObject(json).getJSONArray("conteudos")
                conteudos = toConteudos(itens)
            }
        } catch (e: Exception) {
            Log.e("GetAulas()", e.toString())
        }

        return conteudos
    }

    override fun onPostExecute(conteudos: List<ConteudoModelo>) {
        super.onPostExecute(conteudos)

        onConteudos(conteudos)
    }

}

class GetObjeto(private val conteudo: ConteudoModelo,
                private val diretorioApp: File,
                private val onProgresso: KFunction1<Int, Unit>,
                private val onObjeto: KFunction1<String, Unit>) :
    AsyncTask<Void, Void, String>() {

    override fun doInBackground(vararg v: Void): String {
        var caminho = ""
        onProgresso(0)

        try {
            val zip = getZip()
            caminho = unzip(zip)
        } catch (e: Exception) {
            Log.e("GetObjeto()", e.toString())
        }

        return caminho
    }

    private fun getZip(): File {
        val url = URL(conteudo.objeto)
        val conn: HttpURLConnection = url.openConnection() as HttpURLConnection
        conn.setRequestProperty("content-type", "binary/data");
        conn.connectTimeout = 60000
        val httpStream = conn.inputStream
        onProgresso(1)

        val zip = File("${diretorioApp.absolutePath}/objeto.${conteudo.id}.zip")
        if (zip.exists()) {
            zip.delete()
        }
        val zipStream = FileOutputStream(zip)
        onProgresso(2)

        var bytesLidos = -1;
        val buffer = ByteArray(4096)
        while ((httpStream.read(buffer).also { bytesLidos = it }) != -1) {
            zipStream.write(buffer, 0, bytesLidos)
        }
        onProgresso(3)

        httpStream.close();
        zipStream.close();

        return zip
    }

    private fun unzip(zip: File): String {
        val destino = "${diretorioApp.absolutePath}/objeto.${conteudo.id}"

        val dir = File(destino)
        if (dir.exists()) {
           dir.deleteRecursively()
        }
        dir.mkdir()
        onProgresso(4)

        ZipFile(zip.absolutePath).use { zip ->
            zip.entries().asSequence().forEach { entry ->
                zip.getInputStream(entry).use { input ->
                    val arquivo = "$destino/${entry.name}"

                    if (!entry.isDirectory) {
                        extrairArquivo(input, arquivo)
                    } else {
                        val dir = File(arquivo)
                        dir.mkdir()
                    }
                }
            }
        }
        onProgresso(5)

        return destino
    }

    private fun extrairArquivo(inputStream: InputStream, destFilePath: String) {
        val bos = BufferedOutputStream(FileOutputStream(destFilePath))
        val bytesIn = ByteArray(1024)
        var read: Int
        while (inputStream.read(bytesIn).also { read = it } != -1) {
            bos.write(bytesIn, 0, read)
        }
        bos.close()
    }

    override fun onPostExecute(caminho: String) {
        super.onPostExecute(caminho)

        onObjeto(caminho)
    }

}
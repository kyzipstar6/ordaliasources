package app;

import java.io.File;
import java.io.IOException;
import java.lang.classfile.Label;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

import javax.rmi.ssl.SslRMIClientSocketFactory;

public class Main extends Application{
    public static void(String [] args){
        launch(args);
    }
    public void start(Stage stg){
        stg.setTitle("Java Doku anseher");
        List <Integer> methodsids = new ArrayList<>();
        List <String> methodsnames = new ArrayList<>();
        BorderPane gui = new BorderPane();
        Pane cv = new Pane();
        MenuBar bar = new MenuBar();
        Menu filemenu = new Menu("Datei");
        Menu viewmenu = new Menu("Ansehen");
        MenuItem loaddoc = new MenuItem();

        MenuItem viewout = new MenuItem();
        filemenu.getItems().add(loaddoc);
        viewmenu.getItems().add(viewout);

        bar.getMenus().add(filemenu);
        loaddoc.setOnAction(e->{
            try{
            FileChooser chs = new FileChooser();
            File chsf = chs.showOpenDialog();
            String fcont = new String(Files.readAllBytes(chsf.toPath()));
            String  [] lines =fcont.split("\n");
            VBox alllines = new VBox(2);
            for (int i = 0;i<lines.length; i++){
                String ln = lines.get(i);
                //Creating outline
                if(ln.contains("{") && (ln.contains(" void") || ln.contains("private ")
                || ln.contains("public ")|| ln.contains("final ")|| ln.contains("static ")
            || ln.contains("private")|| ln.contains("private")|| ln.contains("private"))){
                    String[] secs = ln.split(" ");
                    for(int j = 0; j<secs.length; j++){
                        if(secs[j].contains("(")){
                            methodsid.add(i);
                            methodsnames.add(secs[j]);
                        }
                    }
                    
                }
                Label nl =new Label(ln);
                allines.add(nl);
                
            }
            ScrollPane ntxt = new ScrollPane(allines);
            ntxt.setPrefSize(700,500);
            ntxt.setStyle("-fx-padding: 6 px;");
            gui.setCenter(ntxt);

            }catch (IOException ex){
                ex.printStackTrace();
            }
        });

    }
}

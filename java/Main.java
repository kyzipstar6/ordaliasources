package app;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import javafx.animation.Animation;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Application;          
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.text.Font;
import javafx.stage.Stage;
import javafx.util.Duration;

import javafx.beans.property.SimpleObjectProperty;
import javafx.stage.FileChooser;

import app.Main.Language;

public class Main extends Application{
    public static void main(String [] args){
        launch(args);
    }
    SimpleObjectProperty<Language> lang = new SimpleObjectProperty<>(Language.JAVA);
    public enum Language{
        JAVA,
        HTML,PHYTHON,JAVASCRIPT
    }
    public void start(Stage stg){
        stg.setTitle("Doku anseher");
        List <Integer> methodsids = new ArrayList<>();
        List <String> methodsnames = new ArrayList<>();
        BorderPane gui = new BorderPane();
        Pane cv = new Pane();
        MenuBar bar = new MenuBar();

        Menu filemenu = new Menu("Datei");
        Menu langmenu = new Menu("Sprache");
        Menu viewmenu = new Menu("Ansehen");
        MenuItem loaddoc = new MenuItem();
        String  [] langnames = "Java,HTML,Phyton,Javascript".split(",");
        MenuItem [] langitems = new MenuItem[4];
        for (int i = 0; i<langitems.length; i++){
            langitems[i] = new MenuItem(langnames[i]);
            int finalI = i;
            langitems[i].setOnAction(e->{
                lang.set(Language.values()[finalI]);
            });
            
        }

        MenuItem viewout = new MenuItem();
        filemenu.getItems().add(loaddoc);
        viewmenu.getItems().add(viewout);
        langmenu.getItems().addAll(langitems);
        TextArea txt = new TextArea();
                    VBox alllines = new VBox(2);


        bar.getMenus().addAll(filemenu, langmenu, viewmenu);
        loaddoc.setOnAction(e->{
            try{
             
            FileChooser chs = new FileChooser();
            File chsf = chs.showOpenDialog(new Stage());
            String fcont = new String(Files.readAllBytes(chsf.toPath()));
            txt.setText(fcont);
            String  [] lines =fcont.split("\n");
               if(lang.get() == Language.JAVA){
            for (int i = 0;i<lines.length; i++){
                String ln = lines[i];
                //Creating outline
                if(ln.contains("{") && (ln.contains(" void") || ln.contains("private ")
                || ln.contains("public ")|| ln.contains("final ")|| ln.contains("static ")
            || ln.contains("private")|| ln.contains("private")|| ln.contains("private"))){
                    String[] secs = ln.split(" ");
                    for(int j = 0; j<secs.length; j++){
                        if(secs[j].contains("(")){
                            methodsids.add(i);
                            methodsnames.add(secs[j]);
                        }
                    }
                    
                }
                
                
            }
            for (int j = 0; j<methodsnames.size(); j++){
                    int fj =j;
                         Button nl =new Button(methodsnames.get(fj));
                         nl.setOnAction(ev->{
                            txt.positionCaret(methodsids.get(fj));
                                                            txt.setScrollTop(methodsids.get(fj)*20);

                         });
                        alllines.getChildren().add(nl);
                  
                }
            }
            else if(lang.get() == Language.HTML){
                for (int i = 0;i<lines.length; i++){
                    String ln = lines[i];
                    //Creating outline
                    if(ln.contains("<") && ln.contains(">") && !ln.contains("</")){
                        String[] secs = ln.split(" ");
                        for(int j = 0; j<secs.length; j++){
                            if(secs[j].contains("<")){
                                methodsids.add(i);
                                methodsnames.add(secs[j]);
                            }
                        }
                        
                    }
                    
                    
                }
                for (int j = 0; j<methodsnames.size(); j++){
                             Button nl =new Button(methodsnames.get(j));
                             int finalJ = j;
                             nl.setOnAction(ev->{
                                txt.positionCaret(methodsids.get(finalJ));
                                txt.setScrollTop(methodsids.get(finalJ)*20);
                             });
                            alllines.getChildren().add(nl);
                      
                    }
            }
            else if(lang.get() == Language.JAVASCRIPT){
                for (int i = 0;i<lines.length; i++){
                    String ln = lines[i];
                    //Creating outline
                    if(ln.contains("{") && (ln.contains(" function") || ln.contains("private ")
                    || ln.contains("public ")|| ln.contains("final ")|| ln.contains("static ")
                || ln.contains("private")|| ln.contains("private")|| ln.contains("private"))){
                        String[] secs = ln.split(" ");
                        for(int j = 0; j<secs.length; j++){
                            if(secs[j].contains("(")){
                                methodsids.add(i);
                                methodsnames.add(secs[j]);
                            }
                        }
                        
                    }
                    
                    
                }
                for (int j = 0; j<methodsnames.size(); j++){
                             Button nl =new Button(methodsnames.get(j));
                             int finalJ = j;
                             nl.setOnAction(ev->{
                                txt.positionCaret(methodsids.get(finalJ));
                                                                txt.setScrollTop(methodsids.get(finalJ)*20);

                             });
                            alllines.getChildren().add(nl);
                      
                    }
            }
            
            }catch (Exception ex){
                ex.printStackTrace();
            }
        });
        txt.setPrefSize(700,500);
            alllines.setStyle("-fx-padding: 6 px;-fx-background: #bca619;");
            ScrollPane ntxt = new ScrollPane(alllines);
            ntxt.setPrefSize(400,500);
            ntxt.setStyle("-fx-padding: 6 px;-fx-background: #54290f;");
            txt.setStyle("-fx-padding: 6 px;-fx-background: #bc9619;-fx-text-fill: #000000;-fx-font-family: Cascadia;");
            gui.setStyle("-fx-padding: 6 px;-fx-background: #54290f;");
            bar.setStyle("-fx-padding: 6 px;-fx-background: transparent;  -fx-text-fill: #ffffff;-fx-font-family: Cascadia;");
            gui.setRight(ntxt);
            gui.setTop(bar);
            gui.setCenter(txt);
            stg.setScene(new Scene(gui,1100,600));
            stg.show();
    }
}

use std::{path::Path, process::Command};
use tauri::{
    menu::{Menu, MenuItem, Submenu},
    AppHandle, Emitter,
};
use tauri_plugin_dialog::DialogExt;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_details_window(app: AppHandle) {
    let menu = Menu::new(&app);

    tauri::WebviewWindowBuilder::new(
        &app,
        "details",
        tauri::WebviewUrl::App("main-details.html".into()),
    )
    .menu(menu.unwrap())
    .inner_size(400.0, 500.0)
    .title("About")
    .maximizable(false)
    .minimizable(false)
    .resizable(false)
    .focused(true)
    .center()
    .build()
    .unwrap();
}

// https://v2.tauri.app/develop/calling-frontend/
#[tauri::command]
fn create_tab(app: AppHandle, file_name: String) {
    app.emit("create-tab", &file_name).unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet, create_tab, open_details_window])
        .on_menu_event(move |app_handle, event| {
            let app_handle_clone = app_handle.clone();

            // Open file
            if event.id == "open" {
                println!("opening file...");

                app_handle_clone
                    .dialog()
                    .file()
                    .pick_file(move |file_path| {
                        if let Some(path) = file_path {
                            // Convert path to a String for easier manipulation
                            let ss: String = path.to_string().to_owned();
                            let p_path = Path::new(&ss);

                            // Convert file stem (filename without extension) to a String
                            if let Some(filename) =
                                p_path.file_stem().and_then(|stem| stem.to_str())
                            {
                                create_tab(app_handle_clone.clone(), filename.to_string());
                            } else {
                                println!("Failed to retrieve file name.");
                            }
                        } else {
                            println!("No file selected.");
                        }
                    });
            }

            // About
            if event.id == "about" {
                println!("opening about...");

                let menu = Menu::new(app_handle);

                tauri::WebviewWindowBuilder::new(
                    app_handle,
                    "about",
                    tauri::WebviewUrl::App("about.html".into()),
                )
                .menu(menu.unwrap())
                .inner_size(225.0, 184.0)
                .title("About")
                .maximizable(false)
                .minimizable(false)
                .resizable(false)
                .focused(true)
                .center()
                .build()
                .unwrap();
            }

            // User Manual
            if event.id == "user-manual" {
                println!("opening user-manual...");

                let pdf_path = dirs::executable_dir()
                    .unwrap_or_default()
                    .join("assets\\user_manual.pdf");

                Command::new("explorer")
                    .arg(pdf_path)
                    .spawn()
                    .expect("Failed to open user manual");
            }
        })
        .setup(|app| {
            // Menu bar
            let save_menu_item = MenuItem::with_id(app, "open", "Open", true, None::<&str>)?;
            let about_menu_item = MenuItem::with_id(app, "about", "About", true, None::<&str>)?;
            let sum_menu_item =
                MenuItem::with_id(app, "user-manual", "User Manual", true, None::<&str>)?;
            let menu = Menu::with_items(
                app,
                &[
                    &Submenu::with_items(app, "File", true, &[&save_menu_item])?,
                    &Submenu::with_items(app, "Settings", true, &[&about_menu_item])?,
                    &Submenu::with_items(app, "Documents", true, &[&sum_menu_item])?,
                ],
            )?;
            let _ = app.set_menu(menu);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

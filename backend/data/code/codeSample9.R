library(shiny)

# UI
ui <- fluidPage(
  titlePanel("Aplikasi Korelasi dan Regresi Linear Sederhana"),
  
  sidebarLayout(
    sidebarPanel(
      h4("Masukkan Data Secara Manual"),
      numericInput("n_rows", "Jumlah Baris Data:", value = 5, min = 1, max = 100),
      actionButton("generate_table", "Buat Tabel Input"),
      br(),
      h4("Masukkan Data:"),
      uiOutput("manual_input"),
      br(),
      selectInput("x_var", "Pilih Variabel X (Independen):", choices = NULL),
      selectInput("y_var", "Pilih Variabel Y (Dependen):", choices = NULL),
      selectInput("z_var", "Pilih Variabel Z (Opsional):", choices = NULL, selected = NULL),
      checkboxInput("add_regression", "Tambahkan Garis Regresi", value = TRUE),
      actionButton("run_analysis", "Lakukan Analisis"),
      br(),
      h4("Tabel Data"),
      tableOutput("data_table")
    ),
    
    mainPanel(
      tabsetPanel(
        tabPanel(
          "Scatter Plot",
          plotOutput("scatter_plot")
        ),
        tabPanel(
          "Hasil Korelasi",
          verbatimTextOutput("correlation_output")
        ),
        tabPanel(
          "Model Regresi",
          verbatimTextOutput("regression_output")
        )
      )
    )
  )
)

# Server
server <- function(input, output, session) {
  # Reactive data frame for manual input
  manual_data <- reactiveVal(data.frame(X = numeric(), Y = numeric(), Z = numeric()))
  
  # Generate input table dynamically
  observeEvent(input$generate_table, {
    df <- data.frame(
      X = numeric(input$n_rows),
      Y = numeric(input$n_rows),
      Z = numeric(input$n_rows)
    )
    manual_data(df)
    output$manual_input <- renderUI({
      tagList(
        lapply(seq_len(input$n_rows), function(i) {
          fluidRow(
            column(4, numericInput(paste0("X", i), label = paste("X (Baris", i, ")"), value = 0)),
            column(4, numericInput(paste0("Y", i), label = paste("Y (Baris", i, ")"), value = 0)),
            column(4, numericInput(paste0("Z", i), label = paste("Z (Opsional Baris", i, ")"), value = 0))
          )
        })
      )
    })
  })
  
  # Update data frame based on user inputs
  observe({
    req(input$generate_table)
    df <- data.frame(
      X = sapply(seq_len(input$n_rows), function(i) input[[paste0("X", i)]]),
      Y = sapply(seq_len(input$n_rows), function(i) input[[paste0("Y", i)]]),
      Z = sapply(seq_len(input$n_rows), function(i) input[[paste0("Z", i)]])
    )
    manual_data(df)
    
    # Update variable options
    updateSelectInput(session, "x_var", choices = names(df), selected = "X")
    updateSelectInput(session, "y_var", choices = names(df), selected = "Y")
    updateSelectInput(session, "z_var", choices = names(df), selected = "Z")
  })
  
  # Display input data as table
  output$data_table <- renderTable({
    manual_data()
  })
  
  # Scatter Plot
  output$scatter_plot <- renderPlot({
    req(input$x_var, input$y_var)
    data <- manual_data()
    
    plot(
      data[[input$x_var]], 
      data[[input$y_var]],
      col = "#00726B",
      pch = 19,
      xlab = input$x_var,
      ylab = input$y_var,
      main = paste("Scatter Plot", input$y_var, "vs", input$x_var)
    )
    
    if (input$add_regression) {
      model <- lm(as.formula(paste(input$y_var, "~", input$x_var)), data = data)
      abline(model, col = "#00726B", lwd = 2)
    }
  })
  
  # Correlation Analysis
  output$correlation_output <- renderPrint({
    req(input$x_var, input$y_var)
    data <- manual_data()
    cor_xy <- cor(data[[input$x_var]], data[[input$y_var]], use = "complete.obs")
    cat("Koefisien Korelasi (X dan Y):", round(cor_xy, 4), "\n")
    
    if (!is.null(input$z_var) && input$z_var != "") {
      cor_xz <- cor(data[[input$x_var]], data[[input$z_var]], use = "complete.obs")
      cor_yz <- cor(data[[input$y_var]], data[[input$z_var]], use = "complete.obs")
      cat("Koefisien Korelasi (X dan Z):", round(cor_xz, 4), "\n")
      cat("Koefisien Korelasi (Y dan Z):", round(cor_yz, 4), "\n")
    }
  })
  
  # Regression Model
  output$regression_output <- renderPrint({
    req(input$x_var, input$y_var)
    data <- manual_data()
    model <- lm(as.formula(paste(input$y_var, "~", input$x_var)), data = data)
    print(summary(model))
  })
}

# Jalankan aplikasi
shinyApp(ui = ui, server = server)

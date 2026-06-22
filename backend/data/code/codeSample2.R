library(shiny)

# UI
ui <- fluidPage(
  titlePanel("Statistika"),
  
  sidebarLayout(
    sidebarPanel(
      h4("Input Data Manual"),
      textAreaInput("manual_data", 
                    "Masukkan Data (Pisahkan dengan koma, contoh: 1,2,3,4):", 
                    placeholder = "Contoh: 5, 10, 15, 20"),
      actionButton("load_data", "Muat Data"),
      hr(),
      h4("Analisis Data"),
      selectInput("analysis", "Pilih Analisis:", 
                  choices = c("Statistik Deskriptif", "Histogram", "Uji Hipotesis")),
      conditionalPanel(
        condition = "input.analysis == 'Uji Hipotesis'",
        numericInput("mu", "Masukkan Mean Hipotesis:", value = 0)
      ),
      actionButton("analyze", "Analisis")
    ),
    
    mainPanel(
      verbatimTextOutput("output_text"),
      plotOutput("output_plot")
    )
  )
)

# Server
server <- function(input, output, session) {
  
  # Reactive value untuk menyimpan data
  data <- reactiveVal()
  
  # Muat data manual
  observeEvent(input$load_data, {
    req(input$manual_data)
    parsed_data <- as.numeric(unlist(strsplit(input$manual_data, ",")))
    if (any(is.na(parsed_data))) {
      showNotification("Data tidak valid. Pastikan hanya angka yang dipisahkan koma.", type = "error")
    } else {
      data(parsed_data)
      showNotification("Data berhasil dimuat!", type = "message")
    }
  })
  
  # Analisis data
  observeEvent(input$analyze, {
    req(data())
    
    if (input$analysis == "Statistik Deskriptif") {
      output$output_text <- renderPrint({
        summary(data())
      })
      output$output_plot <- renderPlot(NULL)
      
    } else if (input$analysis == "Histogram") {
      output$output_text <- renderPrint(NULL)
      output$output_plot <- renderPlot({
        hist(data(), main = "Histogram Data", 
             xlab = "Nilai", col = "#00726B", border = "white")
      })
      
    } else if (input$analysis == "Uji Hipotesis") {
      output$output_text <- renderPrint({
        t.test(data(), mu = input$mu)
      })
      output$output_plot <- renderPlot(NULL)
    }
  })
}

# Jalankan Aplikasi
shinyApp(ui, server)

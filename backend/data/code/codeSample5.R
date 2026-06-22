library(shiny)

# Define UI
ui <- fluidPage(
  titlePanel("Pengantar Peluang"),
  
  sidebarLayout(
    sidebarPanel(
      h3("Pengaturan"),
      
      selectInput("topic", "Pilih Topik:", choices = c(
        "Ruang Sampel dan Kejadian",
        "Peluang Dasar",
        "Permutasi dan Kombinasi",
        "Peluang Bersyarat"
      )),
      
      conditionalPanel(
        condition = "input.topic == 'Ruang Sampel dan Kejadian'",
        textInput("experiment", "Deskripsi Percobaan:", "Melambungkan sebuah dadu"),
        textInput("sampleSpace", "Masukkan Ruang Sampel (pisahkan dengan koma):", "1,2,3,4,5,6"),
        textInput("event", "Masukkan Kejadian (pisahkan dengan koma):", "1,3,5")
      ),
      
      conditionalPanel(
        condition = "input.topic == 'Peluang Dasar'",
        numericInput("totalOutcome", "Jumlah Total Hasil (N):", value = 6, min = 1),
        numericInput("eventOutcome", "Jumlah Kejadian Favorable (n):", value = 3, min = 0)
      ),
      
      conditionalPanel(
        condition = "input.topic == 'Permutasi dan Kombinasi'",
        selectInput("calculationType", "Pilih Jenis Perhitungan:", choices = c("Permutasi", "Kombinasi")),
        numericInput("n", "Jumlah Total Elemen (n):", value = 5, min = 1),
        numericInput("r", "Jumlah Elemen yang Dipilih (r):", value = 3, min = 0)
      ),
      
      conditionalPanel(
        condition = "input.topic == 'Peluang Bersyarat'",
        numericInput("intersectionAB", "P(A ∩ B):", value = 0.2, min = 0, step = 0.01),
        numericInput("probA", "P(A):", value = 0.5, min = 0, max = 1, step = 0.01)
      ),
      
      actionButton("calculate", "Hitung")
    ),
    
    mainPanel(
      h3("Hasil Perhitungan"),
      verbatimTextOutput("outputResult"),
      conditionalPanel(
        condition = "input.topic == 'Ruang Sampel dan Kejadian'",
        p("Ruang Sampel:", textOutput("sampleSpaceDisplay")),
        p("Kejadian:", textOutput("eventDisplay"))
      )
    )
  )
)

# Define server logic
server <- function(input, output) {
  
  observeEvent(input$calculate, {
    # Ruang Sampel dan Kejadian
    if (input$topic == "Ruang Sampel dan Kejadian") {
      sample_space <- unlist(strsplit(input$sampleSpace, ","))
      event <- unlist(strsplit(input$event, ","))
      output$sampleSpaceDisplay <- renderText({ paste(sample_space, collapse = ", ") })
      output$eventDisplay <- renderText({ paste(event, collapse = ", ") })
      output$outputResult <- renderText({
        paste("Jumlah Ruang Sampel (n(S)):", length(sample_space), 
              "\nJumlah Kejadian (n(A)):", length(event))
      })
    }
    
    # Peluang Dasar
    if (input$topic == "Peluang Dasar") {
      prob <- input$eventOutcome / input$totalOutcome
      output$outputResult <- renderText({ paste("Peluang Kejadian (P(A)):", prob) })
    }
    
    # Permutasi dan Kombinasi
    if (input$topic == "Permutasi dan Kombinasi") {
      if (input$calculationType == "Permutasi") {
        perm <- factorial(input$n) / factorial(input$n - input$r)
        output$outputResult <- renderText({ paste("Jumlah Permutasi:", perm) })
      } else {
        comb <- factorial(input$n) / (factorial(input$r) * factorial(input$n - input$r))
        output$outputResult <- renderText({ paste("Jumlah Kombinasi:", comb) })
      }
    }
    
    # Peluang Bersyarat
    if (input$topic == "Peluang Bersyarat") {
      if (input$probA > 0) {
        cond_prob <- input$intersectionAB / input$probA
        output$outputResult <- renderText({ paste("P(B|A):", cond_prob) })
      } else {
        output$outputResult <- renderText("P(A) harus lebih besar dari nol.")
      }
    }
  })
}

# Run the application 
shinyApp(ui = ui, server = server)

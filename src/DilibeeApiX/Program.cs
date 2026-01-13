using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

var builder = WebApplication.CreateBuilder(args);

// -------------------------------------
// CONFIG
// -------------------------------------
var connectionString =
    builder.Configuration.GetConnectionString("SqlServer")
    ?? "Server=poshcatsql.database.windows.net;Database=tareas;User Id=tareasUser;Password=ReadOnlyPassword!;Encrypt=True;";

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(connectionString));

// -------------------------------------
// CORS
// -------------------------------------
#region Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder
            .SetIsOriginAllowed((host) => true)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});
#endregion

var app = builder.Build();

app.UseCors("CorsPolicy");

// -------------------------------------
// SIMPLE CSP HEADER
// -------------------------------------
//app.Use(async (ctx, next) =>
//{
//    ctx.Response.Headers["Content-Security-Policy"] =
//        "default-src 'self'; connect-src 'self' http://localhost:* ws://localhost:*";
//    await next();
//});

// -------------------------------------
// DILIGENCIAS
// -------------------------------------
app.MapGet("/api/diligencias", async (AppDbContext db) =>
{
    var data = await db.Diligencias.ToListAsync();

    return Results.Ok(new { data, status = 200 });
});

app.MapGet("/api/diligencias/{id:int}", async (int id, AppDbContext db) =>
{
    var diligencia = await db.Diligencias.FindAsync(id);

    if (diligencia == null)
        return Results.NotFound(new { error = "Diligencia no encontrada" });

    return Results.Ok(new { data = diligencia, status = 200 });
});

app.MapGet("/api/diligencias/search", async (string? term, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(term))
    {
        var all = await db.Diligencias.ToListAsync();
        return Results.Ok(new { data = all, status = 200 });
    }

    var result = await db.Diligencias
        .Where(d =>
            d.Titulo!.Contains(term) ||
            d.Descripcion!.Contains(term) ||
            d.Tipo!.Contains(term))
        .ToListAsync();

    return Results.Ok(new { data = result, status = 200 });
});

app.MapPost("/api/diligencias", async (CreateDiligencia body, AppDbContext db) =>
{
    var entity = new Diligencia
    {
        Titulo = body.Titulo,
        Descripcion = body.Descripcion,
        Tipo = body.Tipo,
        Estado = "pendiente",
        FechaCreacion = DateTime.UtcNow,
        UsuarioId = body.UsuarioId
    };

    db.Diligencias.Add(entity);
    await db.SaveChangesAsync();

    return Results.Created("/api/diligencias", new { data = entity, status = 201 });
});

app.MapPost("/api/diligencias/{id:int}/aceptar", async (int id, AceptarDiligencia body, AppDbContext db) =>
{
    var diligencia = await db.Diligencias.FindAsync(id);

    if (diligencia == null)
        return Results.NotFound(new { error = "Diligencia no encontrada" });

    diligencia.Estado = "en-progreso";
    diligencia.GestorId = body.GestorId;

    await db.SaveChangesAsync();

    return Results.Ok(new { data = diligencia, status = 200 });
});

app.MapPost("/api/diligencias/{id:int}/completar", async (int id, CompletarDiligencia body, AppDbContext db) =>
{
    var diligencia = await db.Diligencias
        .FirstOrDefaultAsync(d => d.Id == id && d.GestorId == body.GestorId);

    if (diligencia == null)
        return Results.NotFound(new { error = "Diligencia no encontrada" });

    diligencia.Estado = "completada";
    await db.SaveChangesAsync();

    return Results.Ok(new { data = diligencia, status = 200 });
});

// -------------------------------------
// USUARIOS
// -------------------------------------
app.MapGet("/api/usuarios/{id:int}", async (int id, AppDbContext db) =>
{
    var usuario = await db.Usuarios.FindAsync(id);

    if (usuario == null)
        return Results.NotFound(new { error = "Usuario no encontrado" });

    return Results.Ok(new { data = usuario, status = 200 });
});

// -------------------------------------
// GESTORES
// -------------------------------------
app.MapGet("/api/gestores", async (AppDbContext db) =>
{
    var gestores = await db.Gestores.ToListAsync();
    return Results.Ok(new { data = gestores, status = 200 });
});

app.Run();

// -------------------------------------
// DB CONTEXT
// -------------------------------------
class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Diligencia> Diligencias => Set<Diligencia>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Gestor> Gestores => Set<Gestor>();
}

// -------------------------------------
// ENTITIES
// -------------------------------------
class Diligencia
{
    public int Id { get; set; }
    public string? Titulo { get; set; }
    public string? Descripcion { get; set; }
    public string? Tipo { get; set; }
    public string Estado { get; set; } = "";
    public DateTime FechaCreacion { get; set; }
    public int UsuarioId { get; set; }
    public int? GestorId { get; set; }
}

class Usuario
{
    public int Id { get; set; }
    public string? Nombre { get; set; }
}

class Gestor
{
    public int Id { get; set; }
    public string? Nombre { get; set; }
}

// -------------------------------------
// REQUEST MODELS
// -------------------------------------
record CreateDiligencia(
    string Titulo,
    string? Descripcion,
    string? Tipo,
    int UsuarioId
);

record AceptarDiligencia(int GestorId);
record CompletarDiligencia(int GestorId);
